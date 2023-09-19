const cheerio = require("cheerio")
const axios = require("axios")
const fs = require("fs")
const ExcelJS = require("exceljs")
const readline = require("readline")

const main = async () => {
  let url = ""

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question("Search Job: ", async function (userInput) {
    url = `https://www.jobstreet.com.ph/${userInput}-jobs`

    try {
      const { data: html } = await axios.get(url)
      const $ = cheerio.load(html)
      const obj = []

      // job titles
      $(".z1s6m00 > h1 > a > div > span").each((index, element) => {
        obj.push({ title: $(element).text() })
      })

      // company
      $("a[data-automation=jobCardCompanyLink]").each((index, element) => {
        const jobObj = obj[index]
        obj[index] = { ...jobObj, company: $(element).text() }
      })

      // address
      $("a[data-automation=jobCardLocationLink]").each((index, element) => {
        const jobObj = obj[index]
        obj[index] = { ...jobObj, location: $(element).text() }
      })
      // console.log(obj)

      fs.writeFile("job-data.json", JSON.stringify(obj), (err) => {
        if (err) throw err
        console.log("Job scraped successfully!")
      })

      // Creating an Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet("Jobs")

      // Adding headers to the worksheet
      worksheet.columns = [
        { header: "Title", key: "title", width: 60 },
        { header: "Company", key: "company", width: 50 },
        { header: "Location", key: "location", width: 30 },
      ]

      // Adding the scraped data to the worksheet
      obj.forEach((job) => {
        worksheet.addRow(job)
      })

      // Saving the workbook to a file
      await workbook.xlsx.writeFile("jobs.xlsx")
      console.log("Excel file has been created successfully.")
    } catch (error) {
      console.error("Error:", error.message)
    }

    // rl.close()



    rl.question("Do you want to open the Excel file (y/n)? ", (answer) => {
      if (answer.toLowerCase() === "y") {
        rl.close();
        // Check if the file exists before attempting to open it
        if (fs.existsSync("jobs.xlsx")) {
          const { exec } = require("child_process");
          exec(`start ${"jobs.xlsx"}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error opening the file: ${error}`);
            }
          });
        } else {
          console.error(`The file '${"jobs.xlsx"}' does not exist.`);
        }
      } else {
        rl.close();
      }
    });
  })
}

main()
