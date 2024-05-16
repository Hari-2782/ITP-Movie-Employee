import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Adminleave } from '../Component/Adminleave';
import { EmpoyeePage } from '../Component/Employee';
import { HomePage } from '../Component/Home';
import {EmployeeHomePage} from '../Component/employeehome';
import {Sopi} from '../Component/sopi';

export const AllRouter = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <HomePage />
        },
        {
            path: '/Adminapprove',
            element: <Adminleave />
        },

        {
            path: '/employee',
            element: <EmpoyeePage />
        },
        {
            path: '/employeehome', // Add the path for the Employee Home Page
            element: <EmployeeHomePage /> // Use the EmployeeHomePage component
//export const LeavePage = () => {
},//
        {
            path:'/pir',
            element:<Sopi/>
        }
       
    ]);

    return <RouterProvider router={router} />;
};
