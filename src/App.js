import React, {useEffect, useState} from 'react'
import './App.css'
import {DataTable} from './DataTable'
import transformdata from './transformdata'
import {LineChart, Line, XAxis, YAxis, Tooltip} from 'recharts'

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

  return (
    <main>
      <h1>Covid Fälle in Gladbeck</h1>
      <h2>
        Quelle:{' '}
        <a href="https://www.kreis-re.de/dok/geoatlas/FME/CoStat/Diaggeskra-Gladbeck.html">
          Kreis Recklinghausen
        </a>
      </h2>
      <LineChart width={400} height={400} data={transformdata(data).reverse()}>
        <Line
          name="Inzidenz"
          type="natural"
          dataKey="incidence"
          stroke="#00f"
          dot={false}
        />
        <Line
          type="natural"
          name="Infiziert"
          dataKey="currentlyInfected"
          stroke="#f00"
          dot={false}
        />
        <Line
          type="natural"
          name="Gemeldet"
          dataKey="diffConfirmed"
          stroke="#f0f"
          dot={false}
        />

        <XAxis dataKey="dateAsText" />
        <YAxis domain={[0, 400]} />
        <Tooltip />
      </LineChart>
      <DataTable dataWithDiffs={transformdata(data)} />
    </main>
  )
}

export default App
