import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch saved jobs from the backend
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/saved-jobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setSavedJobs(data.savedJobs);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    fetchSavedJobs();
  }, []);

  const deleteSavedJob = async (jobId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/saved-jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSavedJobs((prevSavedJobs) => prevSavedJobs.filter(job => job._id !== jobId));
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error deleting saved job:', error);
    }
  };

  const whenOnClicklogout = () => {
    localStorage.removeItem('token');
    navigate("/");
  };

  return (
    <div className="container">
      <h2 className="my-3">Saved Jobs</h2>
      <div className="d-flex justify-content-between my-3">
        <button type="button" className="btn btn-primary" onClick={() => navigate('/search')}>Search New Jobs</button>
        <button type="button" className="btn btn-primary" onClick={whenOnClicklogout}>Log Out</button>
      </div>

      {savedJobs.length === 0 ? (
        <h2>No job saved.</h2>
      ) : (
        <div className="row ">
          {savedJobs.map((savedJob) => (
            <div key={savedJob._id} className="col-md-4 mb-3">
              <Card>
                <Card.Body style={{ backgroundColor: "#FFFFF0", minHeight: "200px" }}>
                  <h5 style={{ color: "blue" }}>Job Title: </h5>
                  <Card.Title>{savedJob.jobData.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    <h5 style={{ color: "blue" }}>Company Name: </h5>
                    <h4>{savedJob.jobData.company.name}</h4>
                  </Card.Subtitle>
                  <Card.Text style={{fontWeight: "bold" ,border: "2px",color: "#bb8a00" }}>Job Location : {savedJob.jobData.location}</Card.Text>
                  <Card.Text style={{fontWeight: "bold" ,border: "2px",color: "brown" }}>Job Type : {savedJob.jobData.type}</Card.Text>
                  <a href={savedJob.jobData.url} target="_blank" rel="noreferrer" className="btn btn-dark">Read More</a>
                  <i className="fa-solid fa-trash mx-5" onClick={() => deleteSavedJob(savedJob._id)}></i>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
