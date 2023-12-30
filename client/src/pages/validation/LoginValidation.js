function validation(values) {
  let error = {};
  const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{5,}$/;

  if (values.email === "") {
    error.email = "Email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email Didn't match";
  } else {
    error.email = "";
  }

  // eslint-disable-next-line
  if (values.password == "") {
    //add === if any errors.
    error.password = "Password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password =
      "Password length should be atleast 5 and must have numbers, upper and lower case letters!";
  } else {
    error.password = "";
  }
  return error;
}

export default validation;
