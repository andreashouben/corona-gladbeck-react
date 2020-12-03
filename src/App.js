import React, {useEffect, useState} from 'react'
import './App.css'
import {HiTrendingDown, HiTrendingUp} from 'react-icons/all'

function App() {
  const [data, setData] = useState([])
  useEffect(() => {
    async function getDate() {
      const res = await fetch('/api/data')
      const newData = await res.json()
      setData(newData)
    }

    getDate()
  }, [])

  const diff = (field, curRow, nextRow) => {
    if (!nextRow) {
      return 0
    }
    const diff = curRow[field] - nextRow[field]
    return diff > 0 ? `+${diff}` : diff
  }

  const incidence = (id, data) => {
    const last7Days = data
      .map(row => row.confirmedCases)
      .splice(id, 8)
      .map((value, idx, array) => value - array[idx + 1])
      .filter(val => !isNaN(val))
      .reduce((a, b) => a + b, 0)

    return ((last7Days / 75600) * 100000).toFixed(1)
  }

  const trend = (cur, prev) =>
    !cur || !prev ? (
      ''
    ) : cur - prev === 0 ? (
      ''
    ) : cur - prev > 0 ? (
      <HiTrendingUp color={'red'} title="hoch" />
    ) : (
      <HiTrendingDown color={'green'} title="runter" />
    )

  const rows = data
    .map(row => ({...row, date: new Date(row.date)}))
    .map((row, index) => {
      return (
        <tr
          style={{
            backgroundColor: row.date.getDay() === 1 ? 'aliceblue' : 'none',
          }}
          key={row.date}>
          <td style={{textAlign: 'right'}}>
            {row.date.toLocaleDateString('de-DE', {
              weekday: 'short',
              year: '2-digit',
              month: '2-digit',
              day: '2-digit',
            })}
          </td>
          <td>
            {incidence(index, data)}{' '}
            {trend(incidence(index, data), incidence(index + 1, data))}
          </td>
          <td>
            {row.confirmedCases} ({diff('confirmedCases', row, data[index + 1])}
            )
          </td>

          <td>
            {row.recovered} ({diff('recovered', row, data[index + 1])})
          </td>
          <td>
            {row.deaths} ({diff('deaths', row, data[index + 1])})
          </td>
          <td>
            {row.currentlyInfected} (
            {diff('currentlyInfected', row, data[index + 1])})
          </td>
        </tr>
      )
    })

  return (
    <main>
      <h1>Covid Fälle in Gladbeck</h1>
      <h2>
        Quelle:{' '}
        <a href="https://www.kreis-re.de/dok/geoatlas/FME/CoStat/Diaggeskra-Gladbeck.html">
          Kreis Recklinghausen
        </a>
      </h2>

      {data.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Inzidenz</th>
              <th>Gemeldet</th>
              <th>Genesen</th>
              <th>Verstorben</th>
              <th>Aktuell infiziert</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      ) : (
        'Lade Daten...'
      )}
    </main>
  )
}

export default App
