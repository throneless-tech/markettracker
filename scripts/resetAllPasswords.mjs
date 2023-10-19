import dotenv from "dotenv";
import { Users } from "../dist/collections/Users/index.js";

dotenv.config();

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const getEmails = async () => {
  const response = await fetch(`${API_URL}/api/users?limit=9999`, {
    headers: {
      Authorization: `${Users.slug} API-Key ${API_KEY}`,
    },
  });
  const result = await response.json();
  return result.docs.map((user) => user.email);
};

const resetAllPasswords = async () => {
  const emails = await getEmails();
  console.log("emails:", emails);
  for (let email of emails) {
    console.log("***Resetting email:", email);
    try {
      const req = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await req.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }
};

const resetOnePassword = async () => {
  try {
    const req = await fetch(`${API_URL}/api/users/forgot-password`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${Users.slug} API-Key ${API_KEY}`,
      },
      body: JSON.stringify({
        email: "test@throneless.tech",
      }),
    });
    const data = await req.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

resetAllPasswords();
//resetOnePassword();

export {};
