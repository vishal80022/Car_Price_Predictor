// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./App.css";

// // Set the API URL. For development, it's your local Flask server.
// // For production, we'll set this as an environment variable.
// const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

// function App() {
//   // State for form data
//   const [formData, setFormData] = useState({
//     companies: [],
//     car_models_data: [], // This will hold all models
//     years: [],
//     fuel_types: [],
//   });

//   // State for selected form inputs
//   const [selectedCompany, setSelectedCompany] = useState("");
//   const [selectedModel, setSelectedModel] = useState("");
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedFuelType, setSelectedFuelType] = useState("");
//   const [kmsDriven, setKmsDriven] = useState("");

//   // State for dynamic model dropdown
//   const [filteredModels, setFilteredModels] = useState([]);

//   // State for results
//   const [prediction, setPrediction] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch data from the Flask API on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/get_form_data`);
//         setFormData({
//           companies: response.data.companies || [],
//           car_models_data: response.data.car_models_data || [],
//           years: response.data.years || [],
//           fuel_types: response.data.fuel_types || [],
//         });
//       } catch (err) {
//         setError("Error fetching form data. Is the backend server running?");
//         console.error(err);
//       }
//     };
//     fetchData();
//   }, []);

//   // Handle company change to filter models
//   const handleCompanyChange = (e) => {
//     const company = e.target.value;
//     setSelectedCompany(company);
//     setSelectedModel(""); // Reset model

//     // Filter models based on the selected company
//     const models = formData.car_models_data
//       .filter((car) => car.company === company)
//       .map((car) => car.name)
//       .sort(); // Get a sorted list of model names

//     // Get unique model names
//     setFilteredModels([...new Set(models)]);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default HTML form submission
//     setLoading(true);
//     setPrediction("");
//     setError("");

//     try {
//       const response = await axios.post(`${API_URL}/predict`, {
//         company: selectedCompany,
//         car_model: selectedModel,
//         year: selectedYear,
//         fuel_type: selectedFuelType,
//         kilo_driven: kmsDriven,
//       });
//       setPrediction(response.data.prediction);
//     } catch (err) {
//       setError("Prediction failed. Please check your inputs.");
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="bg-dark App">
//       <div className="container">
//         <div className="row">
//           <div className="card mt-50">
//             <div className="card-header" style={{ textAlign: "center" }}>
//               <h1>Welcome to Car Price Predictor</h1>
//             </div>
//             <div className="card-body">
//               <h5 style={{ textAlign: "center" }}>
//                 This app predicts the price of a car you want to sell. Try
//                 filling the details below:
//               </h5>
//               <br />
//               <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                   <label htmlFor="company">Select the company:</label>
//                   <select
//                     className="form-control"
//                     id="company"
//                     name="company"
//                     value={selectedCompany}
//                     onChange={handleCompanyChange}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Company
//                     </option>
//                     {formData.companies.map((company) => (
//                       <option key={company} value={company}>
//                         {company}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="car_models">Select the model:</label>
//                   <select
//                     className="form-control"
//                     id="car_models"
//                     name="car_models"
//                     value={selectedModel}
//                     onChange={(e) => setSelectedModel(e.target.value)}
//                     required
//                     disabled={!selectedCompany} // Disable until company is selected
//                   >
//                     <option value="" disabled>
//                       Select Model
//                     </option>
//                     {filteredModels.map((model) => (
//                       <option key={model} value={model}>
//                         {model}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="year">Select Year of Purchase:</label>
//                   <select
//                     className="form-control"
//                     id="year"
//                     name="year"
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Year
//                     </option>
//                     {formData.years.map((year) => (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="fuel_type">Select the Fuel Type:</label>
//                   <select
//                     className="form-control"
//                     id="fuel_type"
//                     name="fuel_type"
//                     value={selectedFuelType}
//                     onChange={(e) => setSelectedFuelType(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>
//                       Select Fuel Type
//                     </option>
//                     {formData.fuel_types.map((fuel) => (
//                       <option key={fuel} value={fuel}>
//                         {fuel}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="kilo_driven">Enter Kilometres driven:</label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     id="kilo_driven"
//                     name="kilo_driven"
//                     value={kmsDriven}
//                     onChange={(e) => setKmsDriven(e.target.value)}
//                     placeholder="Enter the kilometres driven"
//                     required
//                   />
//                 </div>

//                 <div className="form-group text-center">
//                   <button
//                     type="submit"
//                     className="btn btn-primary btn-block"
//                     disabled={loading}
//                   >
//                     {loading ? "Predicting..." : "Predict Price"}
//                   </button>
//                 </div>
//               </form>

//               <div className="prediction-result">
//                 {prediction && <h4>Prediction: ₹{prediction}</h4>}
//                 {error && <h4 className="text-danger">{error}</h4>}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// Set the API URL.
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

// --- SVG Icons for the Theme Toggle ---
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);
// --- End of Icons ---

function App() {
  // State for form data
  const [formData, setFormData] = useState({
    companies: [],
    car_models_data: [], // This will hold all models
    years: [],
    fuel_types: [],
  });

  // State for selected form inputs
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");

  // State for dynamic model dropdown
  const [filteredModels, setFilteredModels] = useState([]);

  // State for results
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- State for Theme ---
  const [theme, setTheme] = useState("light"); // 'light' or 'dark'

  // --- Effect to apply theme to body ---
  useEffect(() => {
    // Set the class on the body element
    document.body.className = theme;
  }, [theme]);

  // Fetch data from the Flask API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/get_form_data`);
        setFormData({
          companies: response.data.companies || [],
          car_models_data: response.data.car_models_data || [],
          years: response.data.years || [],
          fuel_types: response.data.fuel_types || [],
        });
      } catch (err) {
        setError("Error fetching form data. Is the backend server running?");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Handle company change to filter models
  const handleCompanyChange = (e) => {
    const company = e.target.value;
    setSelectedCompany(company);
    setSelectedModel(""); // Reset model

    // Filter models based on the selected company
    const models = formData.car_models_data
      .filter((car) => car.company === company)
      .map((car) => car.name)
      .sort(); // Get a sorted list of model names

    // Get unique model names
    setFilteredModels([...new Set(models)]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default HTML form submission
    setLoading(true);
    setPrediction("");
    setError("");

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        company: selectedCompany,
        car_model: selectedModel,
        year: selectedYear,
        fuel_type: selectedFuelType,
        kilo_driven: kmsDriven,
      });
      setPrediction(response.data.prediction);
    } catch (err) {
      setError("Prediction failed. Please check your inputs.");
      console.error(err);
    }
    setLoading(false);
  };

  // --- Theme Toggle Function ---
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // NOTE: The 'bg-dark' class is removed from here
  return (
    <div className="App">
      <div className="container">
        {/* --- New Header with Title and Toggle --- */}
        <header className="app-header">
          <h1>Car Price Predictor</h1>
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </header>

        {/* Removed 'row' and 'mt-50' for custom styling */}
        <div className="card">
          <div className="card-body">
            <p className="card-subtitle">
              This app predicts the price of a car you want to sell. Try
              filling the details below:
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="company">Company</label>
                <select
                  className="form-control"
                  id="company"
                  name="company"
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                  required
                >
                  <option value="" disabled>
                    Select Company
                  </option>
                  {formData.companies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="car_models">Model</label>
                <select
                  className="form-control"
                  id="car_models"
                  name="car_models"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  required
                  disabled={!selectedCompany} // Disable until company is selected
                >
                  <option value="" disabled>
                    Select Model
                  </option>
                  {filteredModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year">Year of Purchase</label>
                <select
                  className="form-control"
                  id="year"
                  name="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  {formData.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fuel_type">Fuel Type</label>
                <select
                  className="form-control"
                  id="fuel_type"
                  name="fuel_type"
                  value={selectedFuelType}
                  onChange={(e) => setSelectedFuelType(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Fuel Type
                  </option>
                  {formData.fuel_types.map((fuel) => (
                    <option key={fuel} value={fuel}>
                      {fuel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="kilo_driven">Kilometres Driven</label>
                <input
                  type="number"
                  className="form-control"
                  id="kilo_driven"
                  name="kilo_driven"
                  value={kmsDriven}
                  onChange={(e) => setKmsDriven(e.target.value)}
                  placeholder="Enter the kilometres driven"
                  required
                  min="0"
                />
              </div>

              <div className="form-group text-center">
                {/* --- Updated Button Class --- */}
                <button
                  type="submit"
                  className="btn-predict"
                  disabled={loading}
                >
                  {loading ? "Predicting..." : "Predict Price"}
                </button>
              </div>
            </form>

            <div className="prediction-result">
              {/* --- Updated Result Styling --- */}
              {prediction && (
                <div className="result-success">
                  Predicted Price: <span>₹{prediction}</span>
                </div>
              )}
              {error && (
                <div className="result-error">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* --- New Footer --- */}
        <footer className="app-footer">
          Built with React & Python
        </footer>
      </div>
    </div>
  );
}

export default App;