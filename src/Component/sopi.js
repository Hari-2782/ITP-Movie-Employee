import React, { useState, useRef } from 'react';
import { Container, Card, CardContent, Grid } from '@material-ui/core';
import QrReader from 'react-qr-reader';
import axios from 'axios';
import { API_URL } from '../API_URL/api_url';
import { NavBar1 } from "../Navigation Bar/eheader";

export const Sopi = () => {
    const [attendanceInfo, setAttendanceInfo] = useState(null);
    const qrRef = useRef(null);

    const handleErrorWebCam = (error) => {
        console.error(error);
    }

    const handleScanWebCam = async (result) => {
        if (result) {
            try {
                const employeeId = result.trim(); // Trim any leading or trailing whitespace
                const payload = {
                    employeeId: employeeId,
                    date: new Date().toISOString().split('T')[0]
                };

                const response = await axios.post(API_URL.ATTENDANCE + employeeId, payload);
                console.log('Response:', response.data); // Add this line to check the response data
                
                if (response.status === 200) {
                    const { message, attendanceRecord } = response.data;
                    console.log('Attendance Record:', attendanceRecord); // Add this line to check the attendance record
                    setAttendanceInfo(attendanceRecord);
                    alert(message);
                } else {
                    alert('Already you take attendance');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to record attendance');
            }
        }
    };

    console.log('Attendance Info:', attendanceInfo); // Add this line to check the attendanceInfo state
    
    return (
        
        <Container>
            <NavBar1/>
            <Card>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                            <h3>Scan QR Code</h3>
                            <QrReader
                                delay={300}
                                style={{ width: '100%' }}
                                onError={handleErrorWebCam}
                                onScan={handleScanWebCam}
                                ref={qrRef}
                            />
                        </Grid>
                        {attendanceInfo && (
                            <Grid item xl={4} lg={4} md={6} sm={12} xs={12}>
                                <h3>Attendance Information</h3>
                                <p>Date: {attendanceInfo.date}</p>
                                <p>Status: {attendanceInfo.status}</p>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </Container>
    );
}
