from google import genai

client = genai.Client(api_key="AQ.Ab8RN6Ix91XGG_iDgBL5L89-5dwWlpDuRZ6WTa2w56BZSfqPoAAQ.Ab8RN6Ix91XGG_iDgBL5L89-5dwWlpDuRZ6WTa2w56BZSfqPoA")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Say hello"
)

print(response.text)