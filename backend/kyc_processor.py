import numpy as np
import cv2
import easyocr
from sklearn.metrics.pairwise import cosine_similarity
from insightface.app import FaceAnalysis
from difflib import SequenceMatcher

# Initialize the InsightFace FaceAnalysis app
def initialize_face_analyzer():
    faceapp = FaceAnalysis(providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])  # Use CUDA if available
    faceapp.prepare(ctx_id=0, det_size=(640, 640))  # Prepare with a suitable detection size
    return faceapp 

reader = easyocr.Reader(['en'], gpu=False)  # Set gpu=True if CUDA is available
faceapp = initialize_face_analyzer()

# Use the faceapp to detect and embed faces
def detect_and_embed_face(image_data, faceapp):
    # Read the image using cv2
    np_img = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    
    if img is None:
        print(f"Error: Could not read image at {image_data}")
        return None

    # Detect faces and extract the first detected face for simplicity
    faces = faceapp.get(img)
    if faces:
        # Access the first face's embedding (assumes single face per image for KYC)
        embedding = faces[0].embedding

        # Normalize embedding to unit vector for consistent cosine similarity
        embedding /= np.linalg.norm(embedding)

        return embedding

    # Return None if no face was detected
    return None
def are_same_person(image_data1, image_data2, faceapp, threshold=0.5):
    
    # Get embeddings for both images
    embedding1 = detect_and_embed_face(image_data1, faceapp)
    embedding2 = detect_and_embed_face(image_data2, faceapp)

    # Ensure both embeddings were created
    if embedding1 is None or embedding2 is None:
        print("Error: Could not detect a face in one or both images.")
        return False

    # Calculate cosine similarity
    similarity = cosine_similarity([embedding1], [embedding2])[0][0]
    print(f"Similarity Score: {similarity:.2f}")

    # Compare similarity to threshold
    return similarity >= threshold

def extract_text_from_image(image_data):
    """Extracts text from an image using EasyOCR."""
    np_img = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    result = reader.readtext(img)
    return [text for (_, text, _) in result]

def check_substrings_in_text(text_list, dob, docn):
    """Checks if name, DOB, and document number are present in the text with approximate matching for name."""
    combined_text = ' '.join(text_list).lower()  
        
    # Direct matching for DOB and document number
    dob_match = dob in combined_text
    docn_match = docn in combined_text
    
    return dob_match, docn_match
def is_close_match(word, word_list, threshold=0.8):
    """Check if the word has a close match in the word_list based on the threshold."""
    for item in word_list:
        if SequenceMatcher(None, word, item).ratio() >= threshold:
            return True
    return False

def searchname_in_list(multi_word_string, word_list):
    # Check for an exact match of the entire multi-word string
    if multi_word_string in word_list:
        return True
    
    # Split the multi-word string into individual words
    words = multi_word_string.split()
    
    # Check for exact or close match for each word
    for word in words:
        if word in word_list or is_close_match(word, word_list):
            return True
    return False