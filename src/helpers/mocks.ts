import axios from "axios";
import { create } from "express-handlebars";
import { LOCAL } from "./interfaces";

export const technicalSpecification = [
  {
    item: "123456789",
    description: "Name of item",
    minimalLengh: 10,
    stock: 11,
    sended: 0,
  },
  {
    item: "123456781",
    description: "Name of item 2",
    minimalLengh: 10,
    stock: 11,
    sended: 0,
  },
  {
    item: "123456722",
    description: "Name of item 3",
    minimalLengh: 10,
    stock: 11,
    sended: 0,
  },
  {
    item: "123456783",
    description: "Name of item 4",
    minimalLengh: 10,
    stock: 11,
    sended: 0,
  },
  {
    item: "123456785",
    description: "Name of item 5",
    minimalLengh: 10,
    stock: 11,
    sended: 0,
  },
];

export async function getLocals(): Promise<LOCAL[]> {
  const data = await axios.get("http://localhost:3001/locals");
  let LOCALS: LOCAL[] = [];

  if (data.data.locals.length === 0) {
    const dt = await creatMock();
    return dt;
  } else {
    data.data.locals.forEach((local: any) => {
      LOCALS.push({
        id: local.id,
        sector_name: local.sector_name,
        sector_locals: local.sector_locals,
      });
    });

    return LOCALS;
  }
}

export const listaMock: LOCAL[] = [
  {
    sector_name: "Bobinagem",
    sector_locals: [
      {
        name: "LINHA 01",
        orders: [
          { order: "ORD-12341", count: 1200 },
          { order: "ORD-56782", count: 3500 },
          { order: "ORD-90123", count: 2400 },
        ],
      },
      {
        name: "LINHA 02",
        orders: [
          { order: "ORD-12344", count: 1200 },
          { order: "ORD-56785", count: 3500 },
          { order: "ORD-90126", count: 2400 },
        ],
      },
      {
        name: "LINHA 03",
        orders: [
          { order: "ORD-12347", count: 1200 },
          { order: "ORD-56788", count: 3500 },
          { order: "ORD-90129", count: 2400 },
        ],
      },
      {
        name: "LINHA 04",
        orders: [
          { order: "ORD-123411", count: 1200 },
          { order: "ORD-567812", count: 3500 },
          { order: "ORD-901213", count: 2400 },
        ],
      },
      {
        name: "LINHA 05",
        orders: [
          { order: "ORD-1234123", count: 1200 },
          { order: "ORD-5678142", count: 3500 },
          { order: "ORD-9012412", count: 2400 },
        ],
      },
      {
        name: "LINHA 06",
        orders: [
          { order: "ORD-1234345", count: 1200 },
          { order: "ORD-567897", count: 3500 },
          { order: "ORD-9012098", count: 2400 },
        ],
      },
    ],
    id: null,
  },
  {
    sector_name: "Montagem",
    sector_locals: [
      {
        name: "LINHA 01",
        orders: [
          { order: "ORD-1234", count: 1200 },
          { order: "ORD-5678", count: 3500 },
          { order: "ORD-9012", count: 2400 },
        ],
      },
      {
        name: "LINHA 02",
        orders: [
          { order: "ORD-21234", count: 1200 },
          { order: "ORD-15678", count: 3500 },
          { order: "ORD-19012", count: 2400 },
        ],
      },
      {
        name: "LINHA 03",
        orders: [
          { order: "ORD-51234", count: 1200 },
          { order: "ORD-45678", count: 3500 },
          { order: "ORD-39012", count: 2400 },
        ],
      },
      {
        name: "LINHA 04",
        orders: [
          { order: "ORD-91234", count: 1200 },
          { order: "ORD-85678", count: 3500 },
          { order: "ORD-69012", count: 2400 },
        ],
      },
      {
        name: "LINHA 05",
        orders: [
          { order: "ORD-51234", count: 1200 },
          { order: "ORD-35678", count: 3500 },
          { order: "ORD-59012", count: 2400 },
        ],
      },
      {
        name: "LINHA 06",
        orders: [
          { order: "ORD-231234", count: 1200 },
          { order: "ORD-265678", count: 3500 },
          { order: "ORD-679012", count: 2400 },
        ],
      },
      {
        name: "MINI MOTOR",
        orders: [
          { order: "ORD-781234", count: 1200 },
          { order: "ORD-905678", count: 3500 },
          { order: "ORD-099012", count: 2400 },
        ],
      },
    ],
    id: null,
  },
];

async function creatMock(): Promise<LOCAL[]> {
  listaMock.forEach(async (mock) => {
    await axios.post("http://localhost:3001/locals/" + mock.id, {
      sector_name: mock.sector_name,
      sector_locals: mock.sector_locals,
    });
  });

  return listaMock;
}
