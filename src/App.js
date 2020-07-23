import React, {useState} from 'react';
import useFetchJobs from './useFetchJobs';
import { Container } from 'react-bootstrap';
import Job from './Job';
import JobsPagination from './JobsPagination';
import SearchForm from './SearchForm';


function App() {
  const [page, setPage] = useState(1);
  const [params, setParams] = useState({});
  const {jobs, loading, error, hasNextPage } = useFetchJobs( params, page );
  
  function handleParamChange(e) {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1);
    setParams( prevParams => {
      return { ...prevParams, [param]: value };
    });
  };

  
  return (
    <Container className="my-4">
      <h1 style={{color: 'white'}} className="mb-3">Github Jobs</h1>
      <SearchForm params={params} onParamChange={handleParamChange} />
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
      { loading && <h1 style={{color:'white'}}>Loading...</h1>}
      { error && <h1 style={{color:'white'}}>Error. Try Refreshing.</h1>}
 
      {jobs.map( job => {
        return <Job key={job.id} job={job} />
      })}

      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
    </Container>
  );
}

export default App;
