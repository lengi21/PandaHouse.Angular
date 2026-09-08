import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  Category,
  CustomerMenu,
  CustomerMenuOverview,
  Dish,
  DishTranslation,
  MenuCategory,
  RestaurantId,
} from '../../../shared/models/menu.model';
import { MenuRepository } from './menu.repository';
import { MockHttpClient } from '../../http/mock-http-client.service';
import { apiUrl } from '../../http/api-endpoints';

const restaurantId = 'panda-house';

interface TrilingualText {
  readonly ka: string;
  readonly en: string;
  readonly ru: string;
}

interface DishSeed {
  readonly id: string;
  readonly price: number;
  readonly name: TrilingualText;
}

function createCategory(
  id: string,
  sortOrder: number,
  imageUrl: string,
  name: TrilingualText,
  dishes: readonly DishSeed[],
): MenuCategory {
  const category: Category = {
    id,
    restaurantId,
    image: { url: imageUrl, width: 1200, height: 800 },
    isVisible: true,
    sortOrder,
    translations: [
      { languageCode: 'ka', name: name.ka },
      { languageCode: 'en', name: name.en },
      { languageCode: 'ru', name: name.ru },
    ],
  };

  return { category, dishes: dishes.map((dish, index) => createDish(category.id, index + 1, dish)) };
}

function createDish(categoryId: string, sortOrder: number, dish: DishSeed): Dish {
  const recipe = recipeByCategory[categoryId] ?? defaultRecipe;
  const translations: readonly DishTranslation[] = [
    { languageCode: 'ka', name: dish.name.ka, description: 'შეფის განსაკუთრებული რეცეპტი.', recipe: recipe.ka },
    { languageCode: 'en', name: dish.name.en, description: 'A special recipe from our chef.', recipe: recipe.en },
    { languageCode: 'ru', name: dish.name.ru, description: 'Особый рецепт от нашего шеф-повара.', recipe: recipe.ru },
  ];

  return {
    id: dish.id,
    restaurantId,
    categoryId,
    image: {
      url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
      width: 900,
      height: 600,
    },
    price: { amountMinor: dish.price * 100, currency: 'GEL' },
    calories: caloriesByCategory[categoryId] ?? null,
    isPublished: true,
    isAvailable: true,
    sortOrder,
    translations,
  };
}

const defaultRecipe: TrilingualText = {
  ka: 'მომზადებულია სეზონური ინგრედიენტებით შეფის რეცეპტის მიხედვით.',
  en: 'Prepared with seasonal ingredients using our chef’s recipe.',
  ru: 'Готовится из сезонных ингредиентов по рецепту шефа.',
};

const recipeByCategory: Readonly<Record<string, TrilingualText>> = {
  pastries: { ka: 'ცომი, იმერული ყველი და კარაქი ცხვება ოქროსფერ ქერქამდე.', en: 'Dough, Imeretian cheese and butter are baked to a golden crust.', ru: 'Тесто, имеретинский сыр и масло запекаются до золотистой корочки.' },
  salads: { ka: 'ახალი ბოსტნეული, მწვანილი და კახური ზეთი მსუბუქად არის შეზავებული.', en: 'Fresh vegetables, herbs and Kakhetian oil are lightly dressed.', ru: 'Свежие овощи, зелень и кахетинское масло слегка заправлены.' },
  'main-dishes': { ka: 'ხორცი ნელა მზადდება სურნელოვან სანელებლებთან და ახალ მწვანილთან ერთად.', en: 'The main ingredients are slowly cooked with aromatic spices and fresh herbs.', ru: 'Основные ингредиенты медленно готовятся с ароматными специями и свежей зеленью.' },
  desserts: { ka: 'ნაზი კრემი და ტრადიციული ტკბილი ინგრედიენტები ფენებად ერთიანდება.', en: 'Delicate cream and traditional sweet ingredients are layered together.', ru: 'Нежный крем и традиционные сладкие ингредиенты соединяются слоями.' },
  'hot-drinks': { ka: 'ახლად მომზადებული სასმელი სურნელოვანი მარცვლებით ან ჩაის ფოთლებით.', en: 'Freshly prepared with aromatic beans or tea leaves.', ru: 'Готовится из ароматных зёрен или чайных листьев.' },
  'cold-drinks': { ka: 'გაცივებული სასმელი მზადდება ნატურალური ხილისა და ცქრიალა წყლით.', en: 'A chilled drink prepared with natural fruit and sparkling water.', ru: 'Охлаждённый напиток из натуральных фруктов и газированной воды.' },
  'alcoholic-drinks': { ka: 'ადგილობრივი ყურძნისგან დამზადებული სასმელი ტრადიციული მეთოდით.', en: 'A local grape drink made with traditional methods.', ru: 'Напиток из местного винограда, изготовленный традиционным способом.' },
  'side-dishes': { ka: 'სეზონური გარნირი მზადდება სუფთა ზეთში და მსუბუქ სანელებლებში.', en: 'A seasonal side is prepared with clean oil and light spices.', ru: 'Сезонный гарнир готовится на чистом масле с лёгкими специями.' },
  soups: { ka: 'ნელი ხარშვით მიღებული ბულიონი ახალი ბოსტნეულით და მწვანილით.', en: 'A slow-simmered broth with fresh vegetables and herbs.', ru: 'Бульон медленного приготовления со свежими овощами и зеленью.' },
};

const caloriesByCategory: Readonly<Record<string, number | null>> = {
  pastries: 480,
  salads: 240,
  'main-dishes': 620,
  desserts: 390,
  'hot-drinks': 90,
  'cold-drinks': 120,
  'alcoholic-drinks': 150,
  'side-dishes': 310,
  soups: 280,
};

export let pandaHouseMenu: CustomerMenu = {
  restaurant: {
    id: restaurantId,
    logo: null,
    coverImage: {
      url: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1600&q=80',
      width: 1600,
      height: 900,
    },
    translations: [
      { languageCode: 'ka', name: 'პანდა ჰაუსი', description: 'თბილი კერძები და სასიამოვნო გარემო.' },
      { languageCode: 'en', name: 'Panda House', description: 'Warm food and a welcoming atmosphere.' },
      { languageCode: 'ru', name: 'Панда Хаус', description: 'Тёплая еда и уютная атмосфера.' },
    ],
    address: 'აღმაშენებლის გამზირი 40D',
    phone: '+995 555 55 22 50',
    openingHours: [
      { day: 'monday', opensAt: '09:00', closesAt: '23:00' },
      { day: 'tuesday', opensAt: '09:00', closesAt: '23:00' },
      { day: 'wednesday', opensAt: '09:00', closesAt: '23:00' },
      { day: 'thursday', opensAt: '09:00', closesAt: '23:00' },
      { day: 'friday', opensAt: '09:00', closesAt: '23:00' },
      { day: 'saturday', opensAt: '09:00', closesAt: '23:00' },
      { day: 'sunday', opensAt: '09:00', closesAt: '23:00' },
    ],
    socialLinks: [
      { platform: 'facebook', url: 'https://www.facebook.com/' },
      { platform: 'instagram', url: 'https://www.instagram.com/' },
    ],
  },
  categories: [
    createCategory('pastries', 1, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', { ka: 'ცომეული', en: 'Pastries', ru: 'Выпечка' }, [
      { id: 'adjarian-khachapuri', price: 1800, name: { ka: 'აჭარული ხაჭაპური', en: 'Adjarian khachapuri', ru: 'Аджарский хачапури' } },
      { id: 'lobiani', price: 1200, name: { ka: 'ლობიანი', en: 'Bean bread', ru: 'Лобиани' } },
      { id: 'kubdari', price: 1600, name: { ka: 'კუბდარი', en: 'Kubdari', ru: 'Кубдари' } },
    ]),
    createCategory('salads', 2, 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80', { ka: 'სალათები', en: 'Salads', ru: 'Салаты' }, [
      { id: 'georgian-salad', price: 1300, name: { ka: 'ქართული სალათი', en: 'Georgian salad', ru: 'Грузинский салат' } },
      { id: 'caesar-salad', price: 1700, name: { ka: 'ცეზარის სალათი', en: 'Caesar salad', ru: 'Салат Цезарь' } },
      { id: 'vegetable-salad', price: 1200, name: { ka: 'ბოსტნეულის სალათი', en: 'Garden vegetable salad', ru: 'Овощной салат' } },
    ]),
    createCategory('main-dishes', 3, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', { ka: 'ძირითადი კერძები', en: 'Main dishes', ru: 'Основные блюда' }, [
      { id: 'chkmeruli', price: 2600, name: { ka: 'ჩქმერული', en: 'Chkmeruli chicken', ru: 'Чкмерули' } },
      { id: 'ojakhuri', price: 2400, name: { ka: 'ოჯახური', en: 'Ojakhuri', ru: 'Оджахури' } },
      { id: 'chashushuli', price: 2500, name: { ka: 'ჩაშუშული', en: 'Chashushuli', ru: 'Чашушули' } },
    ]),
    createCategory('desserts', 4, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80', { ka: 'დესერტი', en: 'Desserts', ru: 'Десерты' }, [
      { id: 'honey-cake', price: 1100, name: { ka: 'თაფლიანი ტორტი', en: 'Honey cake', ru: 'Медовик' } },
      { id: 'napoleon', price: 1100, name: { ka: 'ნაპოლეონი', en: 'Napoleon cake', ru: 'Наполеон' } },
      { id: 'churchkhela', price: 700, name: { ka: 'ჩურჩხელა', en: 'Churchkhela', ru: 'Чурчхела' } },
    ]),
    createCategory('hot-drinks', 5, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80', { ka: 'ცხელი სასმელები', en: 'Hot drinks', ru: 'Горячие напитки' }, [
      { id: 'espresso', price: 500, name: { ka: 'ესპრესო', en: 'Espresso', ru: 'Эспрессо' } },
      { id: 'cappuccino', price: 800, name: { ka: 'კაპუჩინო', en: 'Cappuccino', ru: 'Капучино' } },
      { id: 'tea', price: 600, name: { ka: 'ჩაი', en: 'Tea', ru: 'Чай' } },
    ]),
    createCategory('cold-drinks', 6, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80', { ka: 'ცივი სასმელები', en: 'Cold drinks', ru: 'Холодные напитки' }, [
      { id: 'tarragon-lemonade', price: 700, name: { ka: 'ტარხუნის ლიმონათი', en: 'Tarragon lemonade', ru: 'Лимонад тархун' } },
      { id: 'pear-lemonade', price: 700, name: { ka: 'მსხლის ლიმონათი', en: 'Pear lemonade', ru: 'Грушевый лимонад' } },
      { id: 'mineral-water', price: 400, name: { ka: 'მინერალური წყალი', en: 'Mineral water', ru: 'Минеральная вода' } },
    ]),
    createCategory('alcoholic-drinks', 7, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80', { ka: 'ალკოჰოლური სასმელები', en: 'Alcoholic drinks', ru: 'Алкогольные напитки' }, [
      { id: 'saperavi', price: 1500, name: { ka: 'საფერავი', en: 'Saperavi wine', ru: 'Саперави' } },
      { id: 'rkatsiteli', price: 1400, name: { ka: 'რქაწითელი', en: 'Rkatsiteli wine', ru: 'Ркацители' } },
      { id: 'chacha', price: 900, name: { ka: 'ჭაჭა', en: 'Chacha', ru: 'Чача' } },
    ]),
    createCategory('side-dishes', 8, 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80', { ka: 'გარნირი', en: 'Side dishes', ru: 'Гарниры' }, [
      { id: 'french-fries', price: 700, name: { ka: 'კარტოფილი ფრი', en: 'French fries', ru: 'Картофель фри' } },
      { id: 'grilled-vegetables', price: 1000, name: { ka: 'გრილზე მომზადებული ბოსტნეული', en: 'Grilled vegetables', ru: 'Овощи на гриле' } },
      { id: 'rice', price: 600, name: { ka: 'ბრინჯი', en: 'Rice', ru: 'Рис' } },
    ]),
    createCategory('soups', 9, 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80', { ka: 'სუპები', en: 'Soups', ru: 'Супы' }, [
      { id: 'kharcho', price: 1400, name: { ka: 'ხარჩო', en: 'Kharcho soup', ru: 'Суп харчо' } },
      { id: 'chicken-soup', price: 1300, name: { ka: 'ქათმის სუპი', en: 'Chicken soup', ru: 'Куриный суп' } },
      { id: 'mushroom-soup', price: 1300, name: { ka: 'სოკოს კრემ-სუპი', en: 'Mushroom cream soup', ru: 'Грибной крем-суп' } },
    ]),
  ],
};

export function replaceMockMenuCategories(categories: CustomerMenu['categories']): void {
  pandaHouseMenu = { ...pandaHouseMenu, categories };
}

export function replaceMockRestaurant(restaurant: CustomerMenu['restaurant']): void {
  pandaHouseMenu = { ...pandaHouseMenu, restaurant };
}

@Service()
export class MockMenuRepository implements MenuRepository {
  private readonly http = inject(MockHttpClient);

  getCustomerMenuOverview(id: RestaurantId): Promise<CustomerMenuOverview> {
    return firstValueFrom(
      this.http.get(apiUrl(`/api/restaurants/${id}/menu-overview`), () => {
        if (id !== pandaHouseMenu.restaurant.id) {
          throw new Error(`Restaurant \"${id}\" was not found.`);
        }

        return {
          restaurant: pandaHouseMenu.restaurant,
          categories: pandaHouseMenu.categories.map(({ category }) => category),
        };
      }),
    );
  }

  getMenuDishes(restaurantId: RestaurantId): Promise<readonly Dish[]> {
    return firstValueFrom(
      this.http.get(apiUrl(`/api/restaurants/${restaurantId}/dishes`), () => {
        if (restaurantId !== pandaHouseMenu.restaurant.id) {
          throw new Error(`Restaurant \"${restaurantId}\" was not found.`);
        }

        return pandaHouseMenu.categories.flatMap(({ dishes }) => dishes);
      }),
    );
  }
}
