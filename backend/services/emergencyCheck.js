export const isEmergency = (text) => {
  const emergencySymptoms = [
    "chest pain",
    "difficulty breathing",
    "can't breathe",
    "stroke",
    "seizure",
    "unconscious",
    "heart attack",
    "severe bleeding",
    "blood vomiting",
    "coughing blood"
  ];

  const lowerText = text.toLowerCase();

  return emergencySymptoms.some(
    symptom => lowerText.includes(symptom)
  );
};