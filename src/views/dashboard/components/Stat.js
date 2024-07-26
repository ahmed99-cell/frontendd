import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import axios from 'axios';

const Stat = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [questionsData, setQuestionsData] = useState(Array(12).fill(0));
    const [answersData, setAnswersData] = useState(Array(12).fill(0));

    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    useEffect(() => {
        // Fetch data from API
        axios.get('http://localhost:8080/api/questions')
            .then(response => {
                const data = response.data;

                // Initialize arrays for 12 months
                const questionsCounts = Array(12).fill(0);
                const answersCounts = Array(12).fill(0);

                data.forEach(question => {
                    const questionMonth = new Date(question.createdAt).getMonth();
                    questionsCounts[questionMonth] += 1;

                    question.answers.forEach(answer => {
                        const answerMonth = new Date(answer.createdAt).getMonth();
                        answersCounts[answerMonth] += 1;
                    });
                });

                setQuestionsData(questionsCounts);
                setAnswersData(answersCounts);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleChange = (event) => {
        setMonth(event.target.value);
    };

    const getMonthNames = () => {
        const monthNames = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date(0, i);
            monthNames.push(date.toLocaleString('default', { month: 'long' }));
        }
        return monthNames;
    };

    const monthNames = getMonthNames();

    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, '#9c27b0'], // Changed color of Answers to purple
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: monthNames,
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };

    const seriescolumnchart = [
        {
            name: 'Questions',
            data: questionsData,
        },
        {
            name: 'Answers',
            data: answersData,
        },
    ];

    return (
        <DashboardCard title="Admin Stats" action={
            <Select
                labelId="month-dd"
                id="month-dd"
                value={month}
                size="small"
                onChange={handleChange}
            >
                {monthNames.map((name, index) => (
                    <MenuItem
                        key={index}
                        value={index + 1}
                        style={{ color: index === 0 ? 'red' : 'inherit' }} // Change color of the first month (e.g., January)
                    >
                        {name} 2024
                    </MenuItem>
                ))}
            </Select>
        }>
            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="370px"
            />
        </DashboardCard>
    );
};

export default Stat;
