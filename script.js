'use strict';
// BANKIST APP
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, -1000, 700, -50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Mehran Uzair',
  movements: [50, -100, 500, 460, -90, -150, 1000],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

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

const displayMovements = movements => {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__date">3 days ago</div>
            <div class="movements__value">${mov}</div>
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
  labelBalance.textContent = `${balance}€`;
  acc.balance = balance;
};

// !==========================

// todo => Deposit, Withdrwal & Interest Balance Functions

const despositSum = mov => {
  const deposit = mov.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${deposit}€`;
};

const withdrawalSum = mov => {
  const withdrawal = mov
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(withdrawal)}€`;
};

const calcInterest = acc => {
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumInterest.textContent = `${Math.floor(interest)}€`;
};

// ! ======================
const updateUI = acc => {
  balanceCalc(acc);
  withdrawalSum(acc.movements);
  despositSum(acc.movements);
  calcInterest(acc);
  displayMovements(acc.movements);
};

// todo => Login Functionality Event Handler

let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
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
    updateUI(currentAccount);
    alert(`Transferd Successfully`);
  } else {
    alert('username wrong or Limit Exeeded');
  }
});

// todo => Close Account Functionality.

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
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

// *Challenges Below ⬇️⬇️⬇️

/* 
  ! Coding Challenge => 1; 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const juliaData = [3, 5, 2, 12, 7];
// const kateData = [4, 1, 15, 8, 3];

// const checkDogs = (julia, kate) => {
//   const juliaCorrected = [...julia].slice(1, -2);
//   const jointData = juliaCorrected.concat(kate);

//   jointData.forEach((dog, i) => {
//     if (dog > 3) {
//       console.log(
//         `Dog Number : ${i + 1} is an adult, and is ${dog} years old `
//       );
//     } else {
//       console.log(
//         `Dog Number : ${i + 1} is still a puppy 🐶, and is ${dog} years old `
//       );
//     }
//   });
// };
// checkDogs(juliaData, kateData);

//! Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const testData_1 = [5, 2, 4, 1, 15, 8, 3];
// const testData_2 = [16, 6, 10, 5, 6, 1, 4];

// const calcDogHumanAge = data => {
//   const dogAge = data.map(age => (age <= 2 ? age * 2 : 16 + age * 4));
//   console.log(dogAge);
//   const filteredAge = dogAge.filter(age => age >= 18);

//   return filteredAge;
// };

// console.log(calcDogHumanAge(testData_1));
