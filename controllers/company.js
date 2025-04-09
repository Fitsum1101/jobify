const db = require("../config/db");
const imageDelete = require("../util/file");

const pageSize = 5;

exports.getCompany = async (req, res, next) => {
  // pagenation implementing 5 companey per pages
  try {
    const page = req.query.page ? +req.query.page : 1;
    const take = pageSize;
    const skip = page === 1 ? 0 : pageSize * (page - 1);
    const companeyPerpage = await db.companey.findMany({
      take,
      skip,
    });
    res.status(200).json({
      data: companeyPerpage,
    });
  } catch (error) {
    next(error);
  }
};

exports.searchCompany = async (req, res, next) => {
  //  implemeting searching by companey name
  const title = req.query.q;
  const companey = await db.companey.findMany({
    where: {
      name: {
        contains: title,
      },
    },
  });
  res.status(200).json({ data: { companey } });
};

exports.postCompany = async (req, res, next) => {
  try {
    const name = req.body.name;
    const file = req.file;

    const nameExist = await db.companey.findUnique({
      where: {
        name,
      },
    });
    if (nameExist) {
      return res.status(403).json({
        msg: "name aleady exists",
      });
    }
    const newCompany = await db.companey.create({
      data: {
        logo: file.path,
        name,
      },
    });
    return res.status(403).json({ newCompany });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCompany = async (req, res, next) => {
  const id = +req.params.id;
  const companeyExist = await db.companey.findFirst({
    where: {
      id,
    },
  });
  if (!companeyExist) {
    return res.status(404).json({
      message: "companey does not exists",
    });
  }
  // const companeyDeleted = await db.companey.delete({
  //   where: {
  //     id,
  //   },
  // });
  const companeyDeleted = await db.$transaction([
    db.job.deleteMany({ where: { companey_id: companeyExist.id } }),
    db.companey.delete({ where: { id } }),
  ]);
  await imageDelete(companeyExist.logo);
  return res.status(200).json({ companeyDeleted });
};

exports.editCompany = async (req, res, next) => {
  const id = +req.params.id;
  const { name } = req.body;
  const file = req.file ? req.file : undefined;
  const companeyExist = await db.companey.findFirst({
    where: {
      id,
    },
  });
  if (!companeyExist) {
    return res.status(404).json({
      message: "companey does not exists",
    });
  }
  let updateCompanyCloumns = { name };
  if (file) {
    updateCompanyCloumns.logo = file.path;
    await imageDelete(companeyExist.logo);
  }
  let updateCompaney = await db.companey.update({
    where: {
      id,
    },
    data: {
      ...updateCompanyCloumns,
    },
  });
  return res.status(200).json({
    updateCompaney,
  });
};
