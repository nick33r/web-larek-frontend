import './scss/styles.scss';
// !! Удалить из документации описание того, что классы модели данных наследуют Model


// TODO: Тестируем модель данных:
import { BaseItems } from "./components/model/Items";
import { IItem } from "./types";

const mockItems: IItem[] = [
  {
    id: '1',
    title: 'Product 1',
    price: 100,
    image: 'image1.jpg',
    description: 'Description 1',
    category: 'Category 1',
  },
  {
    id: '2',
    title: 'Product 2',
    price: 200,
    image: 'image2.jpg',
    description: 'Description 2',
    category: 'Category 2',
  },
];

