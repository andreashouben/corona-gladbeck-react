import {HiTrendingDown, HiTrendingUp} from 'react-icons/all'
import React from 'react'

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
    <HiTrendingUp color={'red'} title="steigt" />
  ) : (
    <HiTrendingDown color={'green'} title="sinkt" />
  )

const transformdata = data =>
  data.map((row, idx) => ({
    ...row,
    date: new Date(row.date),
    dateAsText: new Date(row.date).toLocaleDateString(),
    incidence: incidence(idx, data),
    trend: trend(incidence(idx, data), incidence(idx + 1, data)),
    diffConfirmed: diff('confirmedCases', row, data[idx + 1]),
    diffRecovered: diff('recovered', row, data[idx + 1]),
    diffDeaths: diff('deaths', row, data[idx + 1]),
    diffInfected: diff('currentlyInfected', row, data[idx + 1]),
  }))
export default transformdata
