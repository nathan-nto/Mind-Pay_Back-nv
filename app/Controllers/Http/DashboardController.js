"use strict";

const database = use("Database");
const dayjs = use("dayjs");
const Request = use("App/Models/Request");
const Database = use("Database");

class DashboardController {
  async howManyUsers({ request, response }) {
    try {
      return await database
        .table("users")
        .select("id", "profile_image", "name");
    } catch (ex) {
    }
  }

  async paymentsPerYearMonth({ request, response }) {
    const current_year = dayjs().format("YYYY");

    const results = await database
      .select('base_salary', 'extra_hour', 'amount', 'r.created_at as data')
      .from('requests as r')
      .innerJoin("users as u", "u.id", "r.user_id")

    const amounted = new Array(12).fill(0);
    const extra = new Array(12).fill(0)
    const base = new Array(12).fill(0)

    results.forEach((element) => {
      amounted[parseInt(dayjs(element.data).format("MM")) - 1] +=
        element.amount;
      extra[parseInt(dayjs(element.data).format("MM")) - 1] +=
        element.extra_hour;

      base[parseInt(dayjs(element.data).format("MM")) - 1] +=
        element.base_salary;
    });

    return { amounted, extra, base };
  }

  async minderFilter({ request }) {
    try {

      const { minder, ano } = request.post()
      let results;
      if (minder != 0) {
        results = await database
          .select('base_salary', 'extra_hour', 'amount', 'r.created_at as data')
          .from('requests as r')
          .innerJoin("users as u", "u.id", "r.user_id")
          .where('r.user_id', minder)
          .whereRaw(
            'YEAR(r.created_at) = ?', [ano])

      } else {
        results = await database
          .select('base_salary', 'extra_hour', 'amount', 'r.created_at as data')
          .from('requests as r')
          .innerJoin("users as u", "u.id", "r.user_id")
          .whereRaw(
            'YEAR(r.created_at) = ?', [ano])
      }

      const amounted = new Array(12).fill(0);
      const extra = new Array(12).fill(0)
      const base = new Array(12).fill(0)

      results.forEach((element) => {
        amounted[parseInt(dayjs(element.data).format("MM")) - 1] +=
          element.amount;

        extra[parseInt(dayjs(element.data).format("MM")) - 1] +=
          element.extra_hour;

        base[parseInt(dayjs(element.data).format("MM")) - 1] +=
          element.base_salary;
      });

      return { amounted, extra, base };

    } catch (e) {

      console.log(e);
    }
  }
}

module.exports = DashboardController;
