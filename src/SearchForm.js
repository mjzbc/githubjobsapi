import React from 'react';
import { Form, Col } from 'react-bootstrap';

export default function SearchForm({ params, onParamChange }) {

    return (
        <Form className="mb-4">
            <Form.Row className="align-items-end">
                <Form.Group as={Col} >
                    <Form.Label style={{color: 'white'}}>Description</Form.Label>
                    <Form.Control
                        onChange={onParamChange} 
                        value={params.description} 
                        name="description" 
                        type="text" />
                </Form.Group>
                <Form.Group as={Col} >
                    <Form.Label style={{color: 'white'}}>Location</Form.Label>
                    <Form.Control
                        onChange={onParamChange} 
                        value={params.description} 
                        name="location" 
                        type="text" />
                </Form.Group>
                <Form.Group as={Col} xs="auto" className="ml-2">
                    <Form.Check 
                        style={{color: 'white'}}
                        className="mb-2" 
                        onChange={onParamChange} 
                        value={params.full_time} 
                        name="full_time" 
                        id="full-time" 
                        label="Only full-time" 
                        type="checkbox" />
                </Form.Group>
            </Form.Row>
        </Form>        
    )


};