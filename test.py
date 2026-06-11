import google.generativeai as genai

genai.configure(api_key="AQ.Ab8RN6Ix91XGG_iDgBL5L89-5dwWlpDuRZ6WTa2w56BZSfqPoAAQ.Ab8RN6Ix91XGG_iDgBL5L89-5dwWlpDuRZ6WTa2w56BZSfqPoA")

model = genai.GenerativeModel("gemini-1.5-flash")

response = model.generate_content("Say hello")

print(response.text)