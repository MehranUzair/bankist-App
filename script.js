'use strict';
// BANKIST APP
// Data
const account1 = {
  owner: 'Mehran Uzair',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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

//Todo => Display Movements Function

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';
  // todo >=> Sorting Movements Functionality
  const sortArr = (a, b) => a - b;
  const movs = sort ? acc.movements.slice().sort(sortArr) : acc.movements;
  movs.forEach((mov, i) => {
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const showDate = `${day} - ${month} - ${year}`;

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">${showDate}</div>
            <div class="movements__value">${mov.toFixed(2)}</div>
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
  labelBalance.textContent = `${balance.toFixed(2)}€`;
  acc.balance = balance;
};

// !==========================

// todo => Deposit, Withdrwal & Interest Balance Functions

const despositSum = mov => {
  const deposit = mov.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${deposit.toFixed(2)}€`;
};

const withdrawalSum = mov => {
  const withdrawal = mov
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal.toFixed(2))}€`;
};

const calcInterest = acc => {
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const rightNow = new Date();

const showDateTime = () => {
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const min = `${now.getMinutes()}`.padStart(2, 0);
  const hours = now.getHours();

  labelDate.textContent = `${day} - ${month} - ${year}, ${hours} : ${min}`;
};

// ! ======================
const updateUI = acc => {
  balanceCalc(acc);
  withdrawalSum(acc.movements);
  despositSum(acc.movements);
  calcInterest(acc);
  displayMovements(acc);
};

// todo => Login Functionality Event Handler

let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  showDateTime();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Functionality
    updateUI(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
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
    currentAccount.movements.push(+amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
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

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
