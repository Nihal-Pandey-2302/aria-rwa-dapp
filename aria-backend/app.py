# app.py
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import google.generativeai as genai
import requests
import json
from flask_cors import CORS

# --- NEW IMPORTS for QR Code Scanning ---
from pyzbar.pyzbar import decode
from PIL import Image
import cv2
import numpy as np
import pypdf
import io

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- Configuration from .env ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-pro')

def upload_to_ipfs(json_data: dict) -> str:
    # This function remains the same
    if not PINATA_API_KEY or not PINATA_SECRET_API_KEY:
        raise Exception("Pinata API keys not set in .env")
    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY
    }
    files = {
        'file': (f'{json_data.get("name", "rwa_metadata")}.json', json.dumps(json_data), 'application/json')
    }
    response = requests.post("https://api.pinata.cloud/pinning/pinFileToIPFS", files=files, headers=headers)
    response.raise_for_status()
    ipfs_hash = response.json().get("IpfsHash")
    if not ipfs_hash:
        raise Exception("Failed to get IPFS hash from Pinata response")
    return f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"

# --- NEW HELPER FUNCTION for QR Code Scanning ---
def find_and_decode_qr(document_bytes, mime_type):
    """Scans a document (image or PDF) for a QR code and returns its content."""
    try:
        if "pdf" in mime_type:
            pdf_file = pypdf.PdfReader(io.BytesIO(document_bytes))
            for page in pdf_file.pages:
                for image_file_object in page.images:
                    img = Image.open(io.BytesIO(image_file_object.data))
                    decoded_objects = decode(img)
                    if decoded_objects:
                        return decoded_objects[0].data.decode("utf-8")
        else: # Assume it's an image
            img_array = np.frombuffer(document_bytes, np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            decoded_objects = decode(img)
            if decoded_objects:
                return decoded_objects[0].data.decode("utf-8")
        return None
    except Exception as e:
        print(f"QR Code Scan Warning: Could not process file. {e}")
        return None

# --- Main API Endpoint (MODIFIED) ---
@app.route('/analyze_and_prepare', methods=['POST'])
def analyze_and_prepare():
    if 'document' not in request.files:
        return jsonify({"error": "No document part in the request"}), 400
    
    document_file = request.files['document']
    if document_file.filename == '':
        return jsonify({"error": "No selected document"}), 400
    
    if document_file:
        try:
            document_bytes = document_file.read()

            # --- 1. Gemini AI Analysis (no changes here) ---
            contents = [
                {"mime_type": document_file.content_type, "data": document_bytes},
                "Analyze this document. If it is an invoice, extract the invoice total, currency, and date. "
                "Also, determine if it looks authentic (e.g., has signatures, proper formatting). "
                "Output as a JSON object with fields: 'is_invoice', 'total', 'currency', 'date', 'authenticity_score', 'verification_summary'."
            ]
            response = model.generate_content(contents)
            gemini_output_text = response.text.strip()
            if gemini_output_text.startswith("```json"):
                gemini_output_text = gemini_output_text[7:-3].strip()
            
            ai_report_json = json.loads(gemini_output_text)

            # --- 2. QR Code Verification (NEW SECTION) ---
            # --- 2. QR Code Verification (UPGRADED SECTION) ---
            qr_content = find_and_decode_qr(document_bytes, document_file.content_type)
            verification_method = "AI Analysis Only" # Default verification method
            
            # This will hold the data we extract from the QR code
            qr_verified_data = {}

            if qr_content:
                print(f"QR Code found with data: {qr_content}")
                verification_method = "✅ QR Code Confirmed"
                
                # Parse the UPI string from the QR code
                try:
                    params = dict(item.split("=") for item in qr_content.split('?')[1].split('&'))
                    qr_amount = params.get('am')
                    qr_invoice_no = params.get('invoiceNo')
                    
                    if qr_amount:
                        qr_verified_data['Invoice Amount'] = f"₹{qr_amount}"
                    if qr_invoice_no:
                        qr_verified_data['Invoice Number'] = qr_invoice_no
                except Exception as e:
                    print(f"Could not parse QR string: {e}")

            # Add the verification method AND the extracted data to the report
            ai_report_json["verification_method"] = verification_method
            ai_report_json["qr_verified_data"] = qr_verified_data
            
            # --- 3. Prepare Response (no changes in logic here) ---
            raw_total_value = ai_report_json.get("total", "0")
            total_str = str(raw_total_value).replace(",", "")
            authenticity_score = ai_report_json.get("authenticity_score", 0.7)
            
            suggested_value_uandr = 0
            try:
                base_value = float(total_str) * authenticity_score
                suggested_value_uandr = int(base_value * 1_000_000)
            except (ValueError, TypeError):
                pass

            token_id = f"RWA_{document_file.filename.replace('.', '_')}_{os.urandom(4).hex()}"
            nft_metadata = { "name": f"AI Verified RWA: {document_file.filename}", # ... etc
            }
            ipfs_token_uri = upload_to_ipfs(nft_metadata)
            
            transaction_payload = {
                "verify_and_mint": {
                    "token_id": token_id, "owner": request.form.get("owner_address"),
                    "token_uri": ipfs_token_uri, "ai_report": gemini_output_text,
                    "suggested_value": str(suggested_value_uandr), "rwa_publisher": "A.R.I.A. Platform"
                }
            }

            return jsonify({
                "success": True,
                "ai_report_display": ai_report_json, # This now includes the verification_method
                "transaction_payload": transaction_payload,
                "ipfs_link": ipfs_token_uri
            }), 200

        except Exception as e:
            app.logger.error(f"Error during analysis: {e}", exc_info=True)
            return jsonify({"error": f"Internal server error: {str(e)}"}), 500

if __name__ == '__main__':
    # Local development only
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
