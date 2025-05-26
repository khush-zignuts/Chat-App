module.exports = {
  //? Validation Rules
  VALIDATION_RULES: {
    USER: {
      NAME: "required|string|min:1|max:30",
      EMAIL: "required|email",
      PASSWORD:
        "required|min:8|max:16|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$/",
      ACCESSTOKEN: "string",
      PHONENUMBER: "string|min:7|max:15",
      GENDER: "string|in:male,female,other",
      ADDRESS: "string|max:255",
      CITY: "string|max:50",
      COUNTRY: "string|max:50",
    },
  },
};
