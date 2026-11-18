/* =====================================================================
   Secure Bank Ltd. - Banking Utilities
   Practical 3: variables, operators, conditionals, loops, functions
   ===================================================================== */

"use strict";

/* ---------------------------------------------------------------------
   TASK 2: Variables with var, let and const (global constants)
   Naming convention: UPPER_SNAKE_CASE for constants, camelCase otherwise
   --------------------------------------------------------------------- */
const BANK_NAME = "Secure Bank Ltd.";
const MIN_AGE = 21;
const MAX_AGE = 60;
const MIN_INCOME = 15000;
const MIN_CREDIT_SCORE = 650;
const MAX_EMI_RATIO = 0.5; // total EMIs must not exceed 50% of income

var appVersion = "1.0"; // var: function/global scoped (shown for demonstration)
let calculationsDone = 0; // let: can change, block scoped

/* ---------------------------------------------------------------------
   Helper functions (TASK 6: reusable functions with parameters/returns)
   --------------------------------------------------------------------- */

// Read a number from an input box; returns NaN if empty
function getNumber(id) {
  const value = document.getElementById(id).value;
  return value === "" ? NaN : Number(value);
}

// Format a number as Indian rupees, e.g. 125000 -> ₹1,25,000.00
function formatMoney(amount) {
  return "₹" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Show a coloured result message. type: "ok" | "bad" | "warn"
function showResult(elementId, type, lines) {
  let html = '<div class="result ' + type + '">';
  for (let i = 0; i < lines.length; i++) {
    html += "<p>" + lines[i] + "</p>";
  }
  html += "</div>";
  document.getElementById(elementId).innerHTML = html;
}

/* ---------------------------------------------------------------------
   TASK 2: Scope demonstration
   --------------------------------------------------------------------- */
function demonstrateScope() {
  let log = "";

  // var is function scoped: it leaks out of the if-block
  if (true) {
    var varInside = "I am var";
    let letInside = "I am let";
    const constInside = "I am const";
    log += "Inside block -> " + varInside + ", " + letInside + ", " + constInside + "\n";
  }

  log += "Outside block -> varInside: " + varInside + "\n";
  log += "Outside block -> letInside: " + typeof letInside + " (not accessible)\n";
  log += "Outside block -> constInside: " + typeof constInside + " (not accessible)\n\n";

  // var allows redeclaration, let does not
  var balance = 1000;
  var balance = 2000; // allowed with var
  let rate = 5;
  rate = 6; // reassignment allowed with let

  // const cannot be reassigned
  const bank = BANK_NAME;
  try {
    bank = "Another Bank"; // throws TypeError
  } catch (error) {
    log += "const reassignment blocked -> " + error.name + ": " + error.message + "\n";
  }

  log += "var balance (redeclared): " + balance + "\n";
  log += "let rate (reassigned): " + rate + "\n";
  log += "Global let calculationsDone: " + calculationsDone + "\n";
  log += "Global var appVersion: " + appVersion;

  document.getElementById("scopeOutput").textContent = log;
  console.log(log);
}

/* ---------------------------------------------------------------------
   TASKS 3 and 4: Operators, if-else, nested if
   Loan eligibility
   --------------------------------------------------------------------- */

// Returns an object describing whether the applicant is eligible
function checkLoanEligibility(age, income, existingEmi, score, employment) {
  let eligible = false;
  let reasons = [];
  let maxLoan = 0;

  // Relational + logical operators
  if (age < MIN_AGE || age > MAX_AGE) {
    reasons.push("Age must be between " + MIN_AGE + " and " + MAX_AGE + " years.");
  } else {
    // Nested if: age is fine, now check employment
    if (employment === "student" || employment === "unemployed") {
      reasons.push("Applicants must be salaried or self-employed.");
    } else {
      // Nested if: check income
      if (income < MIN_INCOME) {
        reasons.push("Minimum monthly income is " + formatMoney(MIN_INCOME) + ".");
      } else {
        // Nested if: check credit score and EMI burden
        const emiRatio = existingEmi / income; // arithmetic operator
        if (score >= MIN_CREDIT_SCORE && emiRatio <= MAX_EMI_RATIO) {
          eligible = true;
          // Affordable EMI = 50% of income minus existing EMIs
          const affordableEmi = income * MAX_EMI_RATIO - existingEmi;
          // Assume 60 EMIs of capacity as a rough maximum loan
          maxLoan = affordableEmi * 60;
        } else if (score < MIN_CREDIT_SCORE) {
          reasons.push("Credit score must be at least " + MIN_CREDIT_SCORE + ".");
        } else {
          reasons.push("Existing EMIs exceed " + (MAX_EMI_RATIO * 100) + "% of your income.");
        }
      }
    }
  }

  return { eligible: eligible, reasons: reasons, maxLoan: maxLoan };
}

function handleEligibility() {
  const name = document.getElementById("elName").value.trim() || "Applicant";
  const age = getNumber("elAge");
  const income = getNumber("elIncome");
  const existingEmi = getNumber("elEmi");
  const score = getNumber("elScore");
  const employment = document.getElementById("elEmployment").value;

  // Validate input using logical operators
  if (isNaN(age) || isNaN(income) || isNaN(score) || isNaN(existingEmi)) {
    showResult("eligibilityOutput", "warn", ["Please fill in age, income, existing EMIs and credit score."]);
    return;
  }

  const result = checkLoanEligibility(age, income, existingEmi, score, employment);
  calculationsDone += 1; // assignment operator

  if (result.eligible) {
    // Ternary (conditional) operator for credit band
    const band = score >= 750 ? "Excellent" : "Good";
    showResult("eligibilityOutput", "ok", [
      "<strong>" + name + " is eligible for a loan.</strong>",
      "Credit band: " + band,
      "Indicative maximum loan: " + formatMoney(result.maxLoan)
    ]);
  } else {
    showResult("eligibilityOutput", "bad", [
      "<strong>" + name + " is not eligible right now.</strong>"
    ].concat(result.reasons));
  }
}

/* ---------------------------------------------------------------------
   TASK 4: switch statement - interest rate by loan type / account type
   --------------------------------------------------------------------- */
function getLoanRate(loanType) {
  let rate;
  switch (loanType) {
    case "home":
      rate = 8.5;
      break;
    case "car":
      rate = 9.5;
      break;
    case "education":
      rate = 9.0;
      break;
    case "personal":
      rate = 12.0;
      break;
    default:
      rate = 10.0;
  }
  return rate;
}

function getSavingsRate(accountType) {
  switch (accountType) {
    case "savings": return 3.5;
    case "salary": return 4.0;
    case "senior": return 5.0;
    case "current": return 0;
    default: return 3.0;
  }
}

/* ---------------------------------------------------------------------
   TASK 6: EMI formula   EMI = P * r * (1+r)^n / ((1+r)^n - 1)
   --------------------------------------------------------------------- */
function calculateEmi(principal, annualRate, years) {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;

  if (monthlyRate === 0) {
    return principal / months; // no interest case
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function handleEmi() {
  const principal = getNumber("emiAmount");
  const years = getNumber("emiYears");
  let rate = getNumber("emiRate");

  if (isNaN(principal) || isNaN(years) || principal <= 0 || years <= 0) {
    showResult("emiOutput", "warn", ["Enter a valid loan amount and tenure."]);
    document.getElementById("emiTable").innerHTML = "";
    return;
  }

  // If the rate is blank, use the default rate for the loan type
  if (isNaN(rate)) {
    rate = getLoanRate(document.getElementById("emiType").value);
    document.getElementById("emiRate").value = rate;
  }

  const emi = calculateEmi(principal, rate, years);
  const totalPayment = emi * years * 12;
  const totalInterest = totalPayment - principal;
  calculationsDone++; // increment operator

  showResult("emiOutput", "ok", [
    "<strong>Monthly EMI: " + formatMoney(emi) + "</strong>",
    "Total interest: " + formatMoney(totalInterest),
    "Total payment: " + formatMoney(totalPayment)
  ]);

  buildAmortizationTable(principal, rate, years, emi);
}

// TASK 5: for loop - first 12 months of the repayment schedule
function buildAmortizationTable(principal, annualRate, years, emi) {
  const monthlyRate = annualRate / 12 / 100;
  const monthsToShow = Math.min(12, years * 12);
  let balance = principal;

  let html = "<table><thead><tr><th>Month</th><th>EMI</th><th>Interest</th><th>Principal</th><th>Balance</th></tr></thead><tbody>";

  for (let month = 1; month <= monthsToShow; month++) {
    const interestPart = balance * monthlyRate;
    const principalPart = emi - interestPart;
    balance -= principalPart; // compound assignment

    html += "<tr><td>" + month + "</td><td>" + formatMoney(emi) + "</td><td>" +
            formatMoney(interestPart) + "</td><td>" + formatMoney(principalPart) +
            "</td><td>" + formatMoney(Math.max(balance, 0)) + "</td></tr>";
  }

  html += "</tbody></table>";
  document.getElementById("emiTable").innerHTML = html;
}

/* ---------------------------------------------------------------------
   TASK 5: for loop - simple vs compound interest table
   --------------------------------------------------------------------- */
function simpleInterest(principal, rate, years) {
  return (principal * rate * years) / 100;
}

function compoundAmount(principal, rate, years) {
  return principal * Math.pow(1 + rate / 100, years);
}

function handleInterestTable() {
  const principal = getNumber("siPrincipal");
  const rate = getNumber("siRate");
  const years = getNumber("siYears");

  if (isNaN(principal) || isNaN(rate) || isNaN(years) || principal <= 0 || years < 1) {
    document.getElementById("interestTable").innerHTML =
      '<div class="result warn"><p>Enter principal, rate and years (1 or more).</p></div>';
    return;
  }

  let html = "<table><thead><tr><th>Year</th><th>Simple interest</th><th>Simple total</th><th>Compound total</th><th>Extra from compounding</th></tr></thead><tbody>";

  for (let year = 1; year <= years; year++) {
    const si = simpleInterest(principal, rate, year);
    const simpleTotal = principal + si;
    const compoundTotal = compoundAmount(principal, rate, year);
    html += "<tr><td>" + year + "</td><td>" + formatMoney(si) + "</td><td>" +
            formatMoney(simpleTotal) + "</td><td>" + formatMoney(compoundTotal) +
            "</td><td>" + formatMoney(compoundTotal - simpleTotal) + "</td></tr>";
  }

  html += "</tbody></table>";
  document.getElementById("interestTable").innerHTML = html;
}

/* ---------------------------------------------------------------------
   TASK 5: do-while loop - months needed to reach a savings goal
   The body always runs at least once, then checks the condition.
   --------------------------------------------------------------------- */
function monthsToReachGoal(opening, monthlyDeposit, target, annualRate) {
  const monthlyRate = annualRate / 12 / 100;
  const maxMonths = 1200; // safety limit (100 years)
  let balance = opening;
  let months = 0;

  do {
    balance += balance * monthlyRate; // monthly interest
    balance += monthlyDeposit; // monthly deposit
    months++;
  } while (balance < target && months < maxMonths);

  return { months: months, balance: balance, reached: balance >= target };
}

function handleGoal() {
  const opening = getNumber("goalStart");
  const deposit = getNumber("goalDeposit");
  const target = getNumber("goalTarget");
  const rate = getSavingsRate(document.getElementById("goalAccount").value);

  if (isNaN(opening) || isNaN(deposit) || isNaN(target) || deposit < 0 || target <= 0) {
    showResult("goalOutput", "warn", ["Enter opening balance, monthly deposit and target amount."]);
    return;
  }

  if (opening >= target) {
    showResult("goalOutput", "ok", ["You have already reached this goal."]);
    return;
  }

  const plan = monthsToReachGoal(opening, deposit, target, rate);

  if (plan.reached) {
    const yrs = Math.floor(plan.months / 12);
    const mths = plan.months % 12;
    showResult("goalOutput", "ok", [
      "<strong>Goal reached in " + plan.months + " months (" + yrs + " yr " + mths + " mo).</strong>",
      "Interest rate used: " + rate + "% p.a.",
      "Projected balance: " + formatMoney(plan.balance)
    ]);
  } else {
    showResult("goalOutput", "bad", ["The goal is not reachable within 100 years at this deposit."]);
  }
}

/* ---------------------------------------------------------------------
   TASK 5: while loop - mini statement from a list of transactions
   --------------------------------------------------------------------- */
function handleStatement() {
  const opening = getNumber("stOpening");
  const rawTxns = document.getElementById("stTxns").value.split(",");

  if (isNaN(opening)) {
    document.getElementById("statementOutput").innerHTML =
      '<div class="result warn"><p>Enter an opening balance.</p></div>';
    return;
  }

  let balance = opening;
  let index = 0;
  let totalDeposits = 0;
  let totalWithdrawals = 0;
  let rejected = 0;

  let html = "<table><thead><tr><th>#</th><th>Type</th><th>Amount</th><th>Balance</th><th>Status</th></tr></thead><tbody>";
  html += "<tr><td>-</td><td>Opening</td><td>-</td><td>" + formatMoney(balance) + "</td><td>-</td></tr>";

  while (index < rawTxns.length) {
    const amount = Number(rawTxns[index].trim());
    index++;

    if (rawTxns[index - 1].trim() === "" || isNaN(amount) || amount === 0) {
      continue; // skip invalid entries
    }

    if (amount > 0) {
      balance += amount;
      totalDeposits += amount;
      html += "<tr><td>" + index + "</td><td>Deposit</td><td>" + formatMoney(amount) +
              "</td><td>" + formatMoney(balance) + "</td><td>Done</td></tr>";
    } else if (balance + amount >= 0) {
      balance += amount;
      totalWithdrawals += Math.abs(amount);
      html += "<tr><td>" + index + "</td><td>Withdrawal</td><td class='neg'>" + formatMoney(amount) +
              "</td><td>" + formatMoney(balance) + "</td><td>Done</td></tr>";
    } else {
      rejected++;
      html += "<tr><td>" + index + "</td><td>Withdrawal</td><td class='neg'>" + formatMoney(amount) +
              "</td><td>" + formatMoney(balance) + "</td><td>Rejected: insufficient funds</td></tr>";
    }
  }

  html += "</tbody></table>";
  html += '<div class="result ok"><p><strong>Closing balance: ' + formatMoney(balance) + "</strong></p>" +
          "<p>Total deposits: " + formatMoney(totalDeposits) + " | Total withdrawals: " +
          formatMoney(totalWithdrawals) + " | Rejected: " + rejected + "</p></div>";

  document.getElementById("statementOutput").innerHTML = html;
}

/* ---------------------------------------------------------------------
   TASK 9: Automated tests (results appear in the browser console)
   --------------------------------------------------------------------- */
function runTests() {
  const tests = [
    {
      name: "EMI for 5,00,000 at 10% for 5 years (about 10623.52)",
      actual: Math.round(calculateEmi(500000, 10, 5) * 100) / 100,
      expected: 10623.52
    },
    {
      name: "EMI with 0% interest (12000 over 1 year = 1000)",
      actual: calculateEmi(12000, 0, 1),
      expected: 1000
    },
    {
      name: "Simple interest on 1,00,000 at 5% for 2 years = 10000",
      actual: simpleInterest(100000, 5, 2),
      expected: 10000
    },
    {
      name: "Eligible applicant (age 30, 50000 income, score 780)",
      actual: checkLoanEligibility(30, 50000, 0, 780, "salaried").eligible,
      expected: true
    },
    {
      name: "Rejected: underage applicant (age 18)",
      actual: checkLoanEligibility(18, 50000, 0, 780, "salaried").eligible,
      expected: false
    },
    {
      name: "Rejected: low credit score (600)",
      actual: checkLoanEligibility(30, 50000, 0, 600, "salaried").eligible,
      expected: false
    },
    {
      name: "Rejected: EMI burden above 50%",
      actual: checkLoanEligibility(30, 40000, 25000, 780, "salaried").eligible,
      expected: false
    },
    {
      name: "Home loan rate = 8.5",
      actual: getLoanRate("home"),
      expected: 8.5
    },
    {
      name: "Goal reached in 10 months with 0% interest (0 start, 1000/mo, target 10000)",
      actual: monthsToReachGoal(0, 1000, 10000, 0).months,
      expected: 10
    }
  ];

  console.log("=== " + BANK_NAME + " test results ===");
  let passed = 0;
  for (let i = 0; i < tests.length; i++) {
    const ok = tests[i].actual === tests[i].expected;
    if (ok) {
      passed++;
    }
    console.log((ok ? "PASS" : "FAIL") + " - " + tests[i].name +
                " (expected " + tests[i].expected + ", got " + tests[i].actual + ")");
  }
  console.log(passed + " of " + tests.length + " tests passed.");
}

/* ---------------------------------------------------------------------
   TASK 7: Wire up buttons and inputs once the page has loaded
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnScope").addEventListener("click", demonstrateScope);
  document.getElementById("btnEligibility").addEventListener("click", handleEligibility);
  document.getElementById("btnEmi").addEventListener("click", handleEmi);
  document.getElementById("btnInterest").addEventListener("click", handleInterestTable);
  document.getElementById("btnGoal").addEventListener("click", handleGoal);
  document.getElementById("btnStatement").addEventListener("click", handleStatement);

  // Auto-fill the interest rate when the loan type changes (uses switch)
  document.getElementById("emiType").addEventListener("change", function (event) {
    document.getElementById("emiRate").value = getLoanRate(event.target.value);
  });
  document.getElementById("emiRate").value = getLoanRate("home");

  runTests();
});























































































