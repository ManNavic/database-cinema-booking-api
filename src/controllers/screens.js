const { Prisma } = require('@prisma/client')
const prisma = require('../utils/prisma')

const createScreen = async (req, res) => {
  const { number, screenings } = req.body
  const findScreen = await prisma.screen.findFirst({
    where: {
      number: number
    }
  })

  if (!number) {
    return res.status(400).json({ error: 'Missing fields in request body' })
  }

  if (findScreen) {
    return res
      .status(409)
      .json({ error: 'A screen with the provided number already exists' })
  }

  if (screenings) {
    const screen = await prisma.screen.create({
      data: {
        number: number,
        screenings: {
          create: screenings
        }
      },
      include: {
        screenings: true
      }
    })

    res.status(201).json({ screen: screen })
  } else {
    const screen = await prisma.screen.create({
      data: {
        number: number
      }
    })

    res.status(201).json({ screen: screen })
  }
}

module.exports = {
  createScreen
}
