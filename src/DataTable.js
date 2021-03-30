import React, {useState} from 'react'
const DAYS_TO_SHOW_VALUES = 42

export const DataTable = ({dataWithDiffs}) => {
  const [limit, setLimit] = useState(DAYS_TO_SHOW_VALUES)
  const raiseLimit = () => {
    setLimit(limit + DAYS_TO_SHOW_VALUES)
  }
  const rows = dataWithDiffs
    .map(row => {
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
            {row.incidence} {row.trend}
          </td>
          <td>
            {row.confirmedCases} ({row.diffConfirmed})
          </td>

          <td>
            {row.recovered} ({row.diffRecovered})
          </td>
          <td>
            {row.deaths} ({row.diffDeaths})
          </td>
          <td>
            {row.currentlyInfected} ({row.diffInfected})
          </td>
        </tr>
      )
    })
    .splice(0, limit)

  return (
    <>
      {dataWithDiffs.length > 0 ? (
        <div>
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
          {limit < dataWithDiffs.length ? (
            <button onClick={() => raiseLimit()}>Mehr...</button>
          ) : (
            ''
          )}
        </div>
      ) : (
        'Lade Daten...'
      )}
    </>
  )
}
