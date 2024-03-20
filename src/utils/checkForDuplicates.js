const checkForDuplicates = (oldArray, newArray) => {
  console.log(oldArray);
  newArray = newArray.filter((game) => !oldArray.includes(game));
  newArray = [...oldArray, ...newArray];

  return newArray;
};

module.exports = { checkForDuplicates };