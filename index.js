const cheerio = require("cheerio")
const axios = require("axios")

const url = "https://expense-tracker-henna-three.vercel.app/"

const main = async () => {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      // Add other headers as needed
    }

    const { data: html } = await axios.get(url)
    const $ = cheerio.load(html)
    console.log($("h2").text())
  } catch (error) {
    console.error("Error:", error.message)
  }
}

main()
