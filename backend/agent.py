import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY", "DUMMY_KEY"))

# Available models to fallback on if one fails
FALLBACK_MODELS = [
    'gemini-1.5-flash', 
    'gemini-1.5-pro', 
    'gemini-2.5-flash', 
    'gemini-2.5-pro', 
    'gemini-3.0-flash', 
    'gemini-3.0-pro'
]

def classify_issue(description: str) -> dict:
    prompt = f"""
    You are an AI problem resolver agent for a college campus.
    Your task is to classify the student complaint into one of these categories:
    - Bathroom & Hygiene
    - Anti-Ragging & Safety
    - Mess & Food Quality
    - Academic Issues
    - Infrastructure/Maintenance
    - Other

    Rules:
    1. If the input is gibberish or clearly invalid, set 'is_valid' to false.
    2. Suggest a priority: 'Low', 'Medium', or 'High'.
    3. Output your response as valid JSON with keys:
       - 'category': string (one of the 6 allowed)
       - 'confidence': float (between 0 and 1)
       - 'priority': string
       - 'is_valid': boolean

    Complaint description: "{description}"
    """
    
    last_error = None
    for model_name in FALLBACK_MODELS:
        try:
            print(f"Trying model: {model_name}...")
            model = genai.GenerativeModel(model_name)
            # Prompt it to return JSON
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json"
                )
            )
            data = json.loads(response.text)
            # fallback for category mismatch
            if data.get('category') not in ["Bathroom & Hygiene", "Anti-Ragging & Safety", "Mess & Food Quality", "Academic Issues", "Infrastructure/Maintenance", "Other"]:
                data['category'] = 'Other'
            return data
        except Exception as e:
            print(f"Agent Error with {model_name}: {e}")
            last_error = e
            continue
            
    # If all models fail:
    print(f"All models failed. Last error: {last_error}")
    return {
        "category": "Other",
        "confidence": 0.0,
        "priority": "Low",
        "is_valid": True # Assume valid if error so it still gets submitted
    }
