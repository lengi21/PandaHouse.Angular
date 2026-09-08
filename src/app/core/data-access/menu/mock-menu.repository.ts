import { Service } from '@angular/core';
import { CustomerMenu, RestaurantId } from '../../../shared/models/menu.model';
import { MenuRepository } from './menu.repository';

const pandaHouseMenu: CustomerMenu = {
  restaurant: {
    id: 'panda-house',
    name: 'Panda House',
    logo: null,
    coverImage: null,
  },
  categories: [
    {
      category: {
        id: 'signature-dishes',
        restaurantId: 'panda-house',
        image: {
          url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 800,
        },
        isVisible: true,
        sortOrder: 1,
        translations: [
          { languageCode: 'en', name: 'Signature dishes' },
          { languageCode: 'ka', name: 'სპეციალური კერძები' },
          { languageCode: 'ru', name: 'Фирменные блюда' },
        ],
      },
      dishes: [],
    },
    {
      category: {
        id: 'sushi-rolls',
        restaurantId: 'panda-house',
        image: {
          url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 800,
        },
        isVisible: true,
        sortOrder: 2,
        translations: [
          { languageCode: 'en', name: 'Sushi & rolls' },
          { languageCode: 'ka', name: 'სუში და როლები' },
          { languageCode: 'ru', name: 'Суши и роллы' },
        ],
      },
      dishes: [],
    },
    {
      category: {
        id: 'bowls',
        restaurantId: 'panda-house',
        image: {
          url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 800,
        },
        isVisible: true,
        sortOrder: 3,
        translations: [
          { languageCode: 'en', name: 'Bowls & salads' },
          { languageCode: 'ka', name: 'ბოულები და სალათები' },
          { languageCode: 'ru', name: 'Боулы и салаты' },
        ],
      },
      dishes: [],
    },
  ],
};

@Service()
export class MockMenuRepository implements MenuRepository {
  getCustomerMenu(restaurantId: RestaurantId): Promise<CustomerMenu> {
    if (restaurantId !== pandaHouseMenu.restaurant.id) {
      return Promise.reject(new Error(`Restaurant \"${restaurantId}\" was not found.`));
    }

    return Promise.resolve(pandaHouseMenu);
  }
}
