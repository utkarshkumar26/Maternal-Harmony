// const { PythonShell } = require('python-shell');

// let model;

// function loadModel(modelPath) {
//   model = modelPath;
// }

// function predictDiabetes(formData) {
//   return new Promise((resolve, reject) => {
//     const options = {
//       args: [JSON.stringify(formData)],
//     };

//     PythonShell.run('predict.py', options, (err, result) => {
//       if (err) {
//         console.error('Prediction error:', err);
//         reject(err);
//       } else {
//         const prediction = result[0]; // Assuming the prediction is returned as a string
//         resolve(prediction);
//       }
//     });
//   });
// }

// // module.exports = { loadModel, predictDiabetes };
