import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';

function App() {
    const [data, setData] = useState([]);
    useEffect(() => {
        async function getDate() {
            const res = await fetch('/api/data');
            const newData = await res.json()
            setData(newData);
        }

        getDate();
    }, []);

    const diff = (field, curRow, nextRow) => {
        if (!nextRow) {
            return 0
        }
        const diff =  curRow[field] - nextRow[field]
        return diff > 0 ? `+${diff}` : diff
    }

    const rows = data
        .map(row => ({...row, date: new Date(row.date)}))
        .map((row, index) => {
                return (
                    <tr
                        style={{backgroundColor: row.date.getDay() === 1 ? 'aliceblue' : 'none'}}
                        key={row.date}>
                        <td>{row.date.toLocaleDateString(
                            'de-DE',
                            {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            }
                        )}</td>
                        <td>{row.confirmedCases} ({diff('confirmedCases', row, data[index + 1])})</td>
                        <td>{row.recovered} ({diff('recovered', row, data[index + 1])})</td>
                        <td>{row.deaths} ({diff('deaths', row, data[index + 1])})</td>
                        <td>{row.currentlyInfected} ({diff('currentlyInfected', row, data[index + 1])})</td>
                    </tr>
                )
            }
        )

    return (
        <main>
            <h1>Covid Fälle in Gladbeck</h1>

            <table>
                <thead>
                <tr>
                    <th>Datum</th>
                    <th>Gemeldet</th>
                    <th>Genesen</th>
                    <th>Verstorben</th>
                    <th>Aktuell infiziert</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>

        </main>
    );
}

export default App;
