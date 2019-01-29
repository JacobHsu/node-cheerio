const request = require('request');
const cheerio = require('cheerio');

// async 表示該 function 是個非同步的
const getJobs = async () => {
	const Board = 'Soft_Job';
	const nowPage = 0; 
	// https://www.ptt.cc/bbs/Soft_Job/index0.html
	const indexURL = `https://www.ptt.cc/bbs/${Board}/index${nowPage}.html`;
	console.log(indexURL);
	// await 表示要等待這個非同步的結果回傳後才會繼續執行
	let jobslist = await requestCurrentPage(indexURL);
}

const requestCurrentPage = async url => {
  let result = await new Promise((resolve, reject) => {
    request(url, async (err, res, body) => {
      if (err) return reject(err); // rejected


      const jobslist = await cheerioPttJobs(body);
      if (jobslist === null) return null;
      console.log(jobslist);

      const date = new Date();
      let result = {};
      result.list = jobslist.filter(job => job.date === `${date.getMonth() + 1}/${date.getDate()}`);
      resolve(result); //fulfilled
    });
  });
  return result;
};

const cheerioPttJobs = body => {
  const $ = cheerio.load(body);
  const regex = /\[徵才\]/;
  const regex_company_and_job = /\[徵才\](.*)徵+(.*)/;
  const result = [];

  $('.r-ent .title a').each((index, el) => {
    const title = $(el).text();
    if (regex.test(title)) {
      const href = 'https://www.ptt.cc'+ $(el).attr('href');
      const r_ent = $(el).parent().parent();

      const info = regex_company_and_job.exec(title);

      const company = info ? info[1].replace(/誠/, '').trim() : null; // 去掉誠徵的 誠
      const job = info ? info[2].trim() : null;
      const date = r_ent.find('.meta .date').text().trim();
      result.push({ title, company, job, date, href });
    }
  });
  return result.length !== 0 ? result : null;
};

module.exports = {
  getJobs,
};


