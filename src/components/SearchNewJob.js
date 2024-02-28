import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Card from "react-bootstrap/Card";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";
import Alert from './Alert';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    // const url = "https://jobsearch4.p.rapidapi.com/api/v2/Jobs/Latest";
    const url = "https://rapid-linkedin-jobs-api.p.rapidapi.com/search-jobs";
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          // 'X-RapidAPI-Key': '680074bfcdmshaff0eb843bee741p176ed1jsned2c0d89315f',
          'X-RapidAPI-Key': '1920991cb3mshf2535e0824197c8p150fa6jsn3fe8ef041759',
          // 'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
          // 'X-RapidAPI-Host': 'jobsearch4.p.rapidapi.com',
          'X-RapidAPI-Host': 'rapid-linkedin-jobs-api.p.rapidapi.com',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result && result.data) {
        console.log(result.data);
        setJobs(result.data);
      } else {
        console.error("API response does not contain data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const showAlert = (msg, type) => {
    setAlert({
      msg: msg,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1000);
  };

  const whenOnClick = async (job) => {
    const token = localStorage.getItem('token');

    try {
      const decoded = jwtDecode(token);

      console.log(decoded.username);

      const response = await fetch('http://localhost:5000/api/save-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ jobData: job, user: decoded }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        showAlert('Job saved successfully', 'success');
      } else {
        console.error(data.error);
        showAlert('Job already saved', 'info');
      }
    } catch (error) {
      console.error('Error saving job:', error);
      showAlert('Error saving job', 'warning');
    }
  };

  const whenOnClicklogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <div className="container">
      {/* Display the Alert component and pass the alert state */}
      <Alert alert={alert} />

      <h2 className="my-3">Job Listings</h2>
      <div className="d-flex justify-content-between my-3">
        <button type="button" className="btn btn-primary" onClick={() => navigate('/saved-jobs')}>Saved Jobs</button>
        <button type="button" className="btn btn-primary" onClick={whenOnClicklogout}>Log Out</button>
      </div>
      
      <div className="row">
        {jobs.map((job) => (
          // <div key={job.url} className="col-md-4 mb-3">
          <div key={job.url} className="col-md-4 mb-3">
            <Card>
              <Card.Body style={{ backgroundColor: "#FFFFF0" }}>
                <h5 style={{ color: "blue" }}>Job Title: </h5>
                <Card.Title>{job.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <h5 style={{ color: "blue" }}>Company Name: </h5>
                  {/* <h4>{job.company}</h4> */}
                  <h4>{job.company.name}</h4>
                </Card.Subtitle>
                {/* <Card.Text>{job.Source}</Card.Text> */}
                <Card.Text style={{fontWeight: "bold" ,border: "2px",color: "#bb8a00" }}>Job Location : {job.location}</Card.Text>
                <Card.Text style={{fontWeight: "bold" ,border: "2px",color: "brown" }}>Job Type : {job.type}</Card.Text>
                <Card.Text>
                  {/* <a href={job.url} onClick={whenOnClick} target="_blank" rel="noreferrer" className="btn btn-dark">Read More</a> */}
                  <a href={job.url} onClick={whenOnClick} target="_blank" rel="noreferrer" className="btn btn-dark">Read More</a>
                  <a rel="noreferrer" className="btn btn-dark mx-3" onClick={() => whenOnClick(job)}>Save</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
