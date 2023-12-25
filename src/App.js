import React from "react";
import axios from "axios";
import { createWorker } from "tesseract.js";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond/dist/filepond.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
registerPlugin(FilePondPluginImagePreview);
let idtodelete = "";
let identificationNumber = "";
let name = "";
let dateOfBirth = "";
let LastName = "";
let DateofIssue = "";
let DateofExpiry = "";

function AddThisData(AddData) {
  fetch("https://thai-id-ocr-backend-m783.onrender.com/product", {
    method: "POST",
    body: JSON.stringify(AddData),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessing: false,
      ocrText: "",
      pctg: "0.00",
      FData: [],
      showDeleteButton: false,
      showError: false,
      showPopup: false,
      showupdate: false,
    };
    this.pond = React.createRef();
    this.worker = React.createRef();
    this.updateProgressAndLog = this.updateProgressAndLog.bind(this);
    this.SubmitHandler = this.SubmitHandler.bind(this);
    this.DisplayData = this.DisplayData.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  parseOCRResult(extractedText) {
    // Initialize variables to store extracted data

    // Split the text into lines or sections to search for relevant data
    const lines = extractedText.split("\n");

    // Example logic to extract identification number
    identificationNumber =
      lines.find((line) => line.includes("Identification Number")) || "";
    const index = identificationNumber.indexOf("Identification Number");
    const textAfterName = identificationNumber
      .slice(index + "Identification Number".length)
      .trim();
    identificationNumber = textAfterName;
    // Example logic to extract name
    name = lines.find((line) => line.includes("Name")) || "";
    const index1 = name.indexOf("Name");
    const textAfterName1 = name.slice(index1 + "Name".length).trim();
    name = textAfterName1;
    LastName = lines.find((line) => line.includes("Last name")) || "";
    const index2 = LastName.indexOf("Last name");
    const textAfterName2 = LastName.slice(index2 + "Last name".length).trim();
    LastName = textAfterName2;
    // Example logic to extract date of birth
    dateOfBirth = lines.find((line) => line.includes("Date of Birth")) || "";
    const index3 = LastName.indexOf("Date of Birth");
    const textAfterName3 = LastName.slice(
      index3 + "Date of Birth".length
    ).trim();
    dateOfBirth = textAfterName3;
    DateofIssue = lines.find((line) => line.includes("Date of Issue")) || "";
    const index4 = LastName.indexOf("Date of Issue");
    const textAfterName4 = LastName.slice(
      index4 + "Date of Issue".length
    ).trim();
    DateofIssue = textAfterName4;
    DateofExpiry = lines.find((line) => line.includes("Date of Expiry")) || "";
    const index5 = LastName.indexOf("Date of Expiry");
    const textAfterName5 = LastName.slice(
      index5 + "Date of Expiry".length
    ).trim();
    DateofExpiry = textAfterName5;
    // Update state with the extracted data
    this.setState({
      identificationNumber: identificationNumber,
      name: name,
      LastName: LastName,
      dateOfBirth: dateOfBirth,
      DateofIssue: DateofIssue,
      DateofExpiry: DateofExpiry,
    });
  }
  DisplayData() {
    let checkdata = "";

    // Fetch data using Axios without async/await
    axios
      .get("https://thai-id-ocr-backend-m783.onrender.com/product")
      .then((response) => {
        checkdata = response.data;
        console.log(checkdata);
        this.setState({ FData: checkdata });
        // Use the fetched data as needed
        this.setState({ showDeleteButton: true });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.log("Error there:", error);
        // Handle errors here
      });

    // console.log(checkdata);
  }
  SubmitHandler() {
    const AddData = {
      identificationNumber,
      name,
      LastName,
      dateOfBirth,
      DateofIssue,
      DateofExpiry,
    };
    AddThisData(AddData);
    this.setState({ showPopup: true });

    // Reset the popup after 3 seconds (3000 milliseconds)
    setTimeout(() => {
      this.setState({ showPopup: false });
    }, 3000);
  }

  handleUpdate = (event) => {
    event.preventDefault();

    const formData = {
      name: event.target.name.value,
      LastName: event.target.LastName.value,
      dateOfBirth: event.target.dateOfBirth.value,
      DateofIssue: event.target.DateofIssue.value,
      DateofExpiry: event.target.DateofExpiry.value,
    };
    identificationNumber = idtodelete;
    console.log(identificationNumber);
    // Make a PUT request to update data based on identification number
    axios
      .put(`https://thai-id-ocr-backend-m783.onrender.com/product/${identificationNumber}`, formData)
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        // You can update state or perform other actions upon successful update
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        // Handle errors
      });
    if (!this.state.selectedId) {
      this.setState({ showupdate: false });
    } else {
      this.setState({ showupdate: false });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      identificationNumber: event.target.identificationNumber.value,
      name: event.target.name.value,
      LastName: event.target.LastName.value,
      dateOfBirth: event.target.dateOfBirth.value,
      DateofIssue: event.target.DateofIssue.value,
      DateofExpiry: event.target.DateofExpiry.value,
    };

    // Make a POST request to add data
    axios
      .post("https://thai-id-ocr-backend-m783.onrender.com/product", formData)
      .then((response) => {
        console.log("Data added successfully:", response.data);
        this.setState({ showupdate: true });
        // You can update state or perform other actions upon successful addition
      })
      .catch((error) => {
        console.error("Error adding data:", error);
        // Handle errors
      });
  };

  handleDelete() {
    let selectedId = idtodelete;

    axios
      .delete(`https://thai-id-ocr-backend-m783.onrender.com/product/${selectedId}`)
      .then((response) => {
        // Refresh or fetch updated data after deletion
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        // Handle error
      });
    if (!this.state.selectedId) {
      // If no item is selected, show error
      this.setState({ showError: true });
    } else {
      // Perform delete action for the selected item
      // ...
      // Reset the error state
      this.setState({ showError: false });
    }
    setTimeout(() => {
      this.setState({ showError: false });
    }, 3000);
  }

  async doOCR(file) {
    this.setState({
      isProcessing: true,
      ocrText: "",
      pctg: "0.00",
      identificationNumber: "NA",
      name: "",
      LastName: "",
      dateOfBirth: "",
      DateofIssue: "",
      DateofExpiry: "",
    });

    // Loading tesseract.js functions
    await this.worker.load();
    await this.worker.loadLanguage("eng");
    await this.worker.initialize("eng");
    // Sending the File Object into the Recognize function to parse the data
    const {
      data: { text },
    } = await this.worker.recognize(file.file);
    this.parseOCRResult(text);
    this.setState({
      isProcessing: false,
      ocrText: text,
    });

    // Call the parseOCRResult function to extract data from the OCR text
  }
  updateProgressAndLog(m) {
    // Maximum value out of which percentage needs to be
    // calculated. In our case it's 0 for 0 % and 1 for Max 100%
    // DECIMAL_COUNT specifies no of floating decimal points in our
    // Percentage
    var MAX_PARCENTAGE = 1;
    var DECIMAL_COUNT = 2;

    if (m.status === "recognizing text") {
      var pctg = (m.progress / MAX_PARCENTAGE) * 100;
      this.setState({
        pctg: pctg.toFixed(DECIMAL_COUNT),
      });
    }
  }
  componentDidMount() {
    // Logs the output object to Update Progress, which
    // checks for Tesseract JS status & Updates the progress
    this.worker = createWorker({
      logger: (m) => this.updateProgressAndLog(m),
    });
  }
  render() {
    return (
      <div className="App">
        <div className="container">
          <div style={{ marginTop: "10%" }} className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <FilePond
                ref={(ref) => (this.pond = ref)}
                onaddfile={(err, file) => {
                  this.doOCR(file);
                }}
                onremovefile={(err, fiile) => {
                  this.setState({
                    ocrText: "",
                  });
                }}
                allowMultiple={false}
                maxFiles={1}
                maxFileSize="2MB"
              />
            </div>
            <div className="col-md-4"></div>
          </div>
          <div className="card">
            <h5 className="card-header">
              <div style={{ margin: "1%", textAlign: "left" }} className="row">
                <div className="col-md-12">
                  <i
                    className={
                      "fas fa-sync fa-2x " +
                      (this.state.isProcessing ? "fa-spin" : "")
                    }
                  ></i>{" "}
                  <span className="status-text">
                    {this.state.isProcessing
                      ? `Processing Image ( ${this.state.pctg} % )`
                      : "Parsed Text"}{" "}
                  </span>
                </div>
              </div>
            </h5>
            <div className="card-body">
              <div className="card-text">
                {this.state.isProcessing ? (
                  "..........."
                ) : this.state.ocrText.length === 0 ? (
                  "No Valid Text Found / Upload Image to Parse Text From Image"
                ) : (
                  <div>
                    {/* <div>{this.state.ocrText}</div> */}
                    <div>
                      Identification Number : {this.state.identificationNumber}
                    </div>
                    <div>Name : {this.state.name}</div>
                    <div>
                      {this.state.LastName !== "" ? (
                        <div>Last Name: {this.state.LastName}</div>
                      ) : (
                        <div>Last Name is not detected</div>
                      )}
                    </div>
                    <div>
                      {this.state.dateOfBirth !== "" ? (
                        <div>Date of Birth: {this.state.dateOfBirth}</div>
                      ) : (
                        <div>Date of Birth is not detected</div>
                      )}
                    </div>
                    <div>
                      {this.state.DateofIssue !== "" ? (
                        <div>Date of Issue: {this.state.DateofIssue}</div>
                      ) : (
                        <div>Date of Issue is not detected</div>
                      )}
                    </div>
                    <div>
                      {this.state.DateofExpiry !== "" ? (
                        <div>Date of Expiry: {this.state.DateofExpiry}</div>
                      ) : (
                        <div>Date of Expiry is not detected</div>
                      )}
                    </div>
                    <div>
                      <button onClick={this.SubmitHandler}>Add Data</button>
                      {this.state.showPopup && (
                        <div className="popup">
                          <p>Data successfully added!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div></div>
            <button onClick={this.DisplayData}>fetch data</button>
            {this.state.showDeleteButton && (
              <div>
                <div style={{ color: "Black" }}>Data Fetched successfully</div>
                <button onClick={this.handleDelete}>Delete Item</button>
              </div>
            )}
            {this.state.showError && (
              <div style={{ color: "red" }}>
                Error: Please select an item to delete.
              </div>
            )}
            <div>
              <ul className="radio-list">
                {this.state.FData.map((item, index) => (
                  <li key={index}>
                    <input
                      type="radio"
                      id={`item-${index}`}
                      name="itemToDelete"
                      value={item.identificationNumber}
                      onChange={(e) => {
                        idtodelete = e.target.value;
                        console.log("Selected item:", e.target.value);
                      }}
                    />
                    <label htmlFor={`item-${index}`}>
                      <div className="item-details">
                        <p>
                          Identification Number: {item.identificationNumber}
                        </p>
                        <p>Name: {item.name}</p>
                        <p>Last Name: {item.LastName}</p>
                        <p>Date of Birth: {item.dateOfBirth}</p>
                        <p>Date of Issue: {item.DateofIssue}</p>
                        <p>Date of Expiry: {item.DateofExpiry}</p>
                      </div>
                    </label>
                  </li>
                ))}
              </ul>

              <div>
                {this.state.showDeleteButton && (
                  <div>
                    <h1>Update the selected radio button data</h1>
                    <br />
                    <form onSubmit={this.handleUpdate}>
                      <label style={{ color: "black" }}>
                        Name:
                        <input
                          type="text"
                          name="name"
                          defaultValue={this.state.name}
                        />
                      </label>
                      <br />
                      <label style={{ color: "black" }}>
                        Last Name:
                        <input
                          type="text"
                          name="LastName"
                          defaultValue={this.state.LastName}
                        />
                      </label>
                      <br />
                      <label style={{ color: "black" }}>
                        Date of Birth:
                        <input
                          type="text"
                          name="dateOfBirth"
                          defaultValue={this.state.dateOfBirth}
                        />
                      </label>
                      <br />
                      <label style={{ color: "black" }}>
                        Date of Issue:
                        <input
                          type="text"
                          name="DateofIssue"
                          defaultValue={this.state.DateofIssue}
                        />
                      </label>
                      <br />
                      <label style={{ color: "black" }}>
                        Date of Expiry:
                        <input
                          type="text"
                          name="DateofExpiry"
                          defaultValue={this.state.DateofExpiry}
                        />
                      </label>
                      <br />
                      <button type="submit">Update Data</button>
                      {this.state.showupdate && (
                        <div style={{ color: "red" }}>
                          Error: Please select an item to Update.
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          <br />
          <div>
            {/* <button onClick={this.updateData}>Update Data</button> */}
            <form onSubmit={this.handleSubmit}>
              <h1 style={{ color: "white" }}>Add Data Manually</h1>
              <label style={{ color: "white" }}>
                Identification Number:
                <input type="text" name="identificationNumber" />
              </label>
              <br />
              <label style={{ color: "white" }}>
                Name:
                <input type="text" name="name" />
              </label>
              <br />
              <label style={{ color: "white" }}>
                Last Name:
                <input type="text" name="LastName" />
              </label>
              <br />
              <label style={{ color: "white" }}>
                Date of Birth:
                <input type="text" name="dateOfBirth" />
              </label>
              <br />
              <label style={{ color: "white" }}>
                Date of Issue:
                <input type="text" name="DateofIssue" />
              </label>
              <br />
              <label style={{ color: "white" }}>
                Date of Expiry:
                <input type="text" name="DateofExpiry" />
              </label>
              <br />
              <button type="submit">Add Data</button>
              {this.state.showPopup && (
                <div className="popup">
                  <div style={{ color: "white" }}>Data successfully added!</div>
                </div>
              )}
              <br />
            </form>
          </div>
          <div className="ocr-text"></div>
        </div>
      </div>
    );
  }
}

export default App;
