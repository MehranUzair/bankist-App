'use strict';
// BANKIST APP
// Data
const account1 = {
  owner: 'Mehran Uzair',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-05-20T00:00:00.000Z',
    '2023-05-21T00:00:00.000Z',
    '2023-05-22T00:00:00.000Z',
    '2023-05-23T00:00:00.000Z',
    '2023-05-24T00:00:00.000Z',
    '2023-05-25T00:00:00.000Z',
    '2023-05-26T00:00:00.000Z',
    '2023-05-27T00:00:00.000Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-05-20T00:00:00.000Z',
    '2023-05-21T00:00:00.000Z',
    '2023-05-22T00:00:00.000Z',
    '2023-05-23T00:00:00.000Z',
    '2023-05-24T00:00:00.000Z',
    '2023-05-25T00:00:00.000Z',
    '2023-05-26T00:00:00.000Z',
    '2023-05-27T00:00:00.000Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// todo => Time Formating <=<

const timeFormate = (date, locale) => {
  const dateToday = new Date();
  const dayPassed = (now, movDate) =>
    Math.ceil(Math.abs(+now - +movDate) / (1000 * 60 * 60 * 24));

  const passed = dayPassed(dateToday, date);
  if (passed === 1) {
    return 'Today';
  } else if (passed > 1 && passed <= 5) {
    return `${passed} days ago`;
  } else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};
//Todo => Display Movements Function <=<

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  // todo >=> Sorting Movements Functionality
  const sortArr = (a, b) => a - b;
  const movs = sort ? acc.movements.slice().sort(sortArr) : acc.movements;
  movs.forEach((mov, i) => {
    const date = new Date(acc.movementsDates[i]);
    const showDate = timeFormate(date, acc.locale);

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const formatedCur = new Intl.NumberFormat(acc.locale, {
      style: 'currency',
      currency: acc.currency,
    }).format(mov);

    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">${showDate}</div>
            <div class="movements__value">${formatedCur}</div>
          </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// ! ========================================== ;
// Todo => Creating UserName Function

const userName = accs => {
  accs.forEach(acc => {
    const username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('');

    acc.userName = username;
  });
};

userName(accounts);

// !=========================

// todo => Calculating & Printing Total Balance

const balanceCalc = acc => {
  const balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  const intlBalance = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(balance);
  labelBalance.textContent = intlBalance;
  acc.balance = balance;
};

// !==========================

// todo => Deposit, Withdrwal & Interest Balance Functions

const despositSum = acc => {
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const formatedDeposit = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(deposit);
  labelSumIn.textContent = formatedDeposit;
};

const withdrawalSum = acc => {
  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  const formatedWith = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(withdrawal);

  labelSumOut.textContent = formatedWith;
};

const calcInterest = acc => {
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);

  const filteredInt = new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(interest);

  labelSumInterest.textContent = filteredInt;
};

let rightNow = new Date();
const options = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
  hour: 'numeric',
  minute: 'numeric',
};

const showDateTime = code => {
  labelDate.textContent = new Intl.DateTimeFormat(code.locale, options).format(
    rightNow
  );
};

// ! ======================
const updateUI = acc => {
  balanceCalc(acc);
  withdrawalSum(acc);
  despositSum(acc);
  calcInterest(acc);
  displayMovements(acc);
};

const countdown = () => {
  let time = 540;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(countDownFn);

      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  tick();
  const countDownFn = setInterval(tick, 1000);

  return countDownFn;
};

// todo => Login Functionality Event Handler

let currentAccount, timer;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Functionality
    if (timer) clearInterval(timer);
    timer = countdown();
    updateUI(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    showDateTime(currentAccount);
  } else {
    alert('Wrong UserID or Password || User doesnt Exist');
  }
});

// todo => Transfer Money into Other accounts

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.abs(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (
    recieverAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    recieverAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(timer);
    timer = countdown();
    alert(`Transferd Successfully`);
  } else {
    alert('username wrong or Limit Exeeded');
  }
});
// todo => Loan Functionality.

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    document.querySelector('.loader').classList.remove('hidden');
    setTimeout(() => {
      currentAccount.movements.push(+amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      inputLoanAmount.value = '';
      inputLoanAmount.blur();
      document.querySelector('.loader').classList.add('hidden');
      clearInterval(timer);
      timer = countdown();
    }, 2000);
  } else {
    alert('Amount is not Eligible for loan');
  }
});

// !=======================================
// todo >=> Close Account Functionality.

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const currAccIndex = accounts.findIndex(acc => acc === currentAccount);

    accounts.splice(currAccIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    inputCloseUsername.value = inputClosePin.value = '';
  } else {
    alert(`You can only delete your own account`);
  }
});

// todo >=> Sorting movements  <=<
let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Project completed Finaly
