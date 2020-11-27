const axios = require('axios');
const HtmlNode = require('node-html-parser');
const requireFromString = require('require-from-string');

module.exports = async (req, res) => {
    const response = await axios.get('https://www.kreis-re.de/dok/geoatlas/FME/CoStat/Diaggeskra-Gladbeck.html');
    const page = response.data;
    const root = HtmlNode.parse(page);
    let script = root.querySelectorAll('script')[1].innerHTML;
    script =
        `
    const document = {
        getElementById: () => ({
          getContext: () => { }
        })
      };
      
      class Chart {
      
      }
    ` + script + 'module.exports = data;'

    const data = requireFromString(script)

    let year = 2020

    const transformedData = data.labels
        .map((label, index) => {
            const [day, month] = label.split('.')
            const date = new Date(year, month - 1, day)
            if (month === '12' && day === '31') {
                year++
            }
            const confirmedCases = data.datasets[0].data[index];
            const recovered = data.datasets[1].data[index];
            const deaths = data.datasets[2].data[index];
            const currentlyInfected = data.datasets[3].data[index];
            return {
                date,
                confirmedCases,
                recovered,
                deaths,
                currentlyInfected
            }
        })
        .sort((a,b) => a - b)
        .reverse()


    res.send(transformedData)
}
