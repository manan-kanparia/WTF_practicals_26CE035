"use strict";

/* CityCare Hospital - Patient Registration
   Rule-based validation: every field has one validator that returns
   an error message ("" means the field is fine). */

const byId = (id) => document.getElementById(id);

const PATTERN = {
    name: /^[A-Za-z]+( [A-Za-z]+)*$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    mobile: /^[6-9][0-9]{9}$/
};

const SPECIALS = "@$!%*?&";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

/* ---------- small helpers ---------- */

const val = (id) => byId(id).value.trim();

function passwordScore(text) {
    const tests = [
        text.length >= 8,
        /[a-z]/.test(text),
        /[A-Z]/.test(text),
        /[0-9]/.test(text),
        new RegExp("[" + SPECIALS.replace(/[$*?]/g, "\\$&") + "]").test(text)
    ];
    return tests.filter(Boolean).length;
}

function isStrongPassword(text) {
    return text.length >= 8 && text.length <= 30 && passwordScore(text) === 5;
}

/* ---------- validators ---------- */

const validators = [
    {
        errorId: "nameError",
        fields: ["fullName"],
        focus: "fullName",
        run() {
            const v = val("fullName");
            if (!v) return "Full name is required.";
            if (!PATTERN.name.test(v)) return "Use letters and single spaces only.";
            return "";
        }
    },
    {
        errorId: "emailError",
        fields: ["email"],
        focus: "email",
        run() {
            const v = val("email");
            if (!v) return "Email address is required.";
            if (!PATTERN.email.test(v)) return "Enter a valid email address.";
            return "";
        }
    },
    {
        errorId: "mobileError",
        fields: ["mobile"],
        focus: "mobile",
        run() {
            const v = val("mobile");
            if (!v) return "Mobile number is required.";
            if (!PATTERN.mobile.test(v)) return "Enter a 10-digit number starting with 6, 7, 8 or 9.";
            return "";
        }
    },
    {
        errorId: "dobError",
        fields: ["dob"],
        focus: "dob",
        run() {
            const v = byId("dob").value;
            if (!v) return "Date of birth is required.";
            const picked = new Date(v);
            const today = new Date();
            if (picked > today) return "Date of birth cannot be a future date.";
            if (today.getFullYear() - picked.getFullYear() > 120) return "Please enter a realistic date of birth.";
            return "";
        }
    },
    {
        errorId: "genderError",
        fields: ["gender"],
        focus: null,
        run() {
            const chosen = document.querySelector("input[name='gender']:checked");
            return chosen ? "" : "Please choose a gender.";
        }
    },
    {
        errorId: "bloodError",
        fields: ["bloodGroup"],
        focus: "bloodGroup",
        run() {
            return byId("bloodGroup").value ? "" : "Please choose a blood group.";
        }
    },
    {
        errorId: "addressError",
        fields: ["address"],
        focus: "address",
        run() {
            const v = val("address");
            if (!v) return "Address is required.";
            if (v.length < 10) return "Address needs at least 10 characters.";
            return "";
        }
    },
    {
        errorId: "passwordError",
        fields: ["password"],
        focus: "password",
        run() {
            const v = byId("password").value;
            if (!v) return "Password is required.";
            if (!isStrongPassword(v)) {
                return "Use 8-30 characters with upper case, lower case, a digit and one of " + SPECIALS;
            }
            return "";
        }
    },
    {
        errorId: "confirmPasswordError",
        fields: ["confirmPassword"],
        focus: "confirmPassword",
        run() {
            const again = byId("confirmPassword").value;
            if (!again) return "Please re-enter your password.";
            if (again !== byId("password").value) return "The two passwords are different.";
            return "";
        }
    },
    {
        errorId: "fileError",
        fields: ["document"],
        focus: "document",
        run() {
            const files = byId("document").files;
            if (files.length === 0) return "";           // upload is optional
            const file = files[0];
            if (!ALLOWED_TYPES.includes(file.type)) return "Allowed file types: JPG, PNG, PDF.";
            if (file.size > MAX_FILE_BYTES) return "The file is larger than 5 MB.";
            return "";
        }
    },
    {
        errorId: "termsError",
        fields: ["terms"],
        focus: "terms",
        run() {
            return byId("terms").checked ? "" : "Please tick the confirmation box.";
        }
    }
];

/* Runs one validator and shows or clears its message. Returns true if OK. */
function applyValidator(validator) {
    const message = validator.run();
    byId(validator.errorId).textContent = message;
    return message === "";
}

/* ---------- password strength meter ---------- */

const strengthLevels = [
    { max: 2, label: "Weak", color: "#d32f2f" },
    { max: 4, label: "Medium", color: "#f57c00" },
    { max: 5, label: "Strong", color: "#2e7d32" }
];

function showStrength() {
    const meter = byId("passwordStrength");
    const text = byId("password").value;

    if (!text) {
        meter.textContent = "";
        return;
    }

    const score = passwordScore(text);
    const level = strengthLevels.find((item) => score <= item.max);
    meter.textContent = "Strength: " + level.label + " (" + score + "/5)";
    meter.style.color = level.color;
}

byId("password").addEventListener("input", () => {
    showStrength();
    // keep the confirm box in step once the person has started filling it
    if (byId("confirmPassword").value !== "") {
        applyValidator(validators.find((v) => v.errorId === "confirmPasswordError"));
    }
});

/* ---------- live checking (one listener for the whole form) ---------- */

const form = byId("registrationForm");

function validateFromEvent(event) {
    const key = event.target.name === "gender" ? "gender" : event.target.id;
    const match = validators.find((v) => v.fields.includes(key));
    if (match) applyValidator(match);
}

form.addEventListener("focusout", validateFromEvent);
form.addEventListener("change", validateFromEvent);

/* ---------- submit ---------- */

form.addEventListener("submit", (event) => {
    event.preventDefault();
    byId("successMessage").textContent = "";

    // run every validator (no early exit) so all messages appear together
    const results = validators.map((validator) => ({
        validator,
        ok: applyValidator(validator)
    }));

    const firstBad = results.find((r) => !r.ok);

    if (firstBad) {
        const target = firstBad.validator.focus;
        if (target) byId(target).focus();
        else document.querySelector("input[name='gender']").focus();
        return;
    }

    const patient = val("fullName");
    byId("successMessage").textContent =
        "Thank you, " + patient + "! Your registration was completed successfully.";

    form.reset();
    byId("passwordStrength").textContent = "";
});
