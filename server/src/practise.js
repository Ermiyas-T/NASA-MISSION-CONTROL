//array of objects which are nested
// const practise = [
//   {
//     id: 1,
//     name: "John",
//     age: 30,
//     address: {
//       street: "123 Main St",
//       city: "New York",
//       zip: "10001",
//     },
//   },
//   {
//     id: 2,
//     name: "Jane",
//     age: 25,
//     address: {
//       street: "456 Elm St",
//       city: "Los Angeles",
//       zip: "90001",
//     },
//   },
//   {
//     id: 3,
//     name: "Mike",
//     age: 35,
//     address: {
//       street: "789 Oak St",
//       city: "Chicago",
//       zip: "60601",
//     },
//   },
// ];
// Map collection objects
const practise = new Map();
practise.set(1, {
  id: 1,
  name: "John",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York",
    zip: "10001",
  },
});
const result = practise.has(0); // true
console.log(result);
// function isUserExist(id) {
//   return practise.some((user) => user.id === id);
// }
// function exist(id) {
//   return practise.has();
// }
// const result = isUserExist(1); // true
// console.log(result);
