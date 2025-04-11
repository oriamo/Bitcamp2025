import { UserPreferences } from '../preferences';

// TheMealDB API base URL
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Recipe model interfaces
export interface Recipe {
  id: string;
  name: string;
  category: string;
  area: string;
  instructions: string;
  thumbnail: string;
  tags: string[];
  youtubeUrl?: string;
  ingredients: Ingredient[];
  source?: string;
}

export interface Ingredient {
  name: string;
  measure: string;
}

export interface RecipeStep {
  number: number;
  description: string;
  image?: string; // Some recipes might have step images
}

export interface RecipeDetail extends Recipe {
  steps: RecipeStep[];
}

// API Response interfaces
interface MealDBResponse {
  meals: MealDBMeal[] | null;
}

interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  // Ingredients (up to 20)
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strIngredient16: string | null;
  strIngredient17: string | null;
  strIngredient18: string | null;
  strIngredient19: string | null;
  strIngredient20: string | null;
  // Measures (up to 20)
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
  strMeasure16: string | null;
  strMeasure17: string | null;
  strMeasure18: string | null;
  strMeasure19: string | null;
  strMeasure20: string | null;
}

class RecipeService {
  private static instance: RecipeService;

  private constructor() {}

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  // Process meal data from the API into our Recipe model
  private processMealData(meal: MealDBMeal): Recipe {
    const ingredients: Ingredient[] = [];
    
    // Extract up to 20 ingredients and measures
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof MealDBMeal] as string;
      const measure = meal[`strMeasure${i}` as keyof MealDBMeal] as string;
      
      // Only add if ingredient is not empty
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : '',
        });
      }
    }
    
    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      thumbnail: meal.strMealThumb,
      tags: meal.strTags ? meal.strTags.split(',').map(tag => tag.trim()) : [],
      youtubeUrl: meal.strYoutube || undefined,
      ingredients,
      source: meal.strSource || undefined,
    };
  }

  // Parse recipe instructions into discrete steps
  private parseInstructionsIntoSteps(recipe: Recipe): RecipeStep[] {
    // Split by period followed by space or newline or numbered steps
    const instructionText = recipe.instructions;
    
    // Try to split by numbered steps (e.g., "1.", "2.", etc.)
    const numberedStepRegex = /\d+\.\s+/g;
    const hasNumberedSteps = numberedStepRegex.test(instructionText);
    
    let rawSteps: string[] = [];
    
    if (hasNumberedSteps) {
      // Split by numbered steps
      rawSteps = instructionText.split(/\d+\.\s+/).filter(step => step.trim() !== '');
      // Add back a missing first step if the text starts with a number
      if (instructionText.match(/^\d+\.\s+/)) {
        rawSteps.unshift(instructionText.match(/^\d+\.\s+(.*?)(?=\d+\.\s+|$)/s)?.[1] || '');
      }
    } else {
      // Split by period followed by space or newline
      rawSteps = instructionText.split(/\.\s+|\.\n+/).filter(step => step.trim() !== '');
    }
    
    // Create steps with sequential numbers
    return rawSteps.map((step, index) => ({
      number: index + 1,
      description: step.trim() + (step.endsWith('.') ? '' : '.'),
      // We don't have step images from TheMealDB, but the model allows for them
    }));
  }

  // Convert a Recipe to a RecipeDetail with steps
  private recipeToDetail(recipe: Recipe): RecipeDetail {
    return {
      ...recipe,
      steps: this.parseInstructionsIntoSteps(recipe),
    };
  }

  // Search recipes by name
  async searchRecipes(query: string): Promise<Recipe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
      const data: MealDBResponse = await response.json();
      
      if (!data.meals) {
        return [];
      }
      
      return data.meals.map(meal => this.processMealData(meal));
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  }
  
  // Get recipe details by ID
  async getRecipeById(id: string): Promise<RecipeDetail | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
      const data: MealDBResponse = await response.json();
      
      if (!data.meals || data.meals.length === 0) {
        return null;
      }
      
      const recipe = this.processMealData(data.meals[0]);
      return this.recipeToDetail(recipe);
    } catch (error) {
      console.error('Error getting recipe details:', error);
      return null;
    }
  }
  
  // Filter recipes by main ingredient
  async getRecipesByIngredient(ingredient: string): Promise<Recipe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
      const data: MealDBResponse = await response.json();
      
      if (!data.meals) {
        return [];
      }
      
      // Because the filter endpoint returns limited data, we need to fetch full details for each recipe
      const recipePromises = data.meals.map(meal => this.getRecipeById(meal.idMeal));
      const recipes = await Promise.all(recipePromises);
      
      // Filter out any null results and convert to Recipe[]
      return recipes.filter(recipe => recipe !== null) as RecipeDetail[];
    } catch (error) {
      console.error('Error getting recipes by ingredient:', error);
      return [];
    }
  }
  
  // Get recipes by category
  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      const data: MealDBResponse = await response.json();
      
      if (!data.meals) {
        return [];
      }
      
      // Because the filter endpoint returns limited data, we need to fetch full details for each recipe
      const recipePromises = data.meals.map(meal => this.getRecipeById(meal.idMeal));
      const recipes = await Promise.all(recipePromises);
      
      // Filter out any null results and convert to Recipe[]
      return recipes.filter(recipe => recipe !== null) as RecipeDetail[];
    } catch (error) {
      console.error('Error getting recipes by category:', error);
      return [];
    }
  }
  
  // Get all recipe categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories.php`);
      const data = await response.json();
      
      if (!data.categories) {
        return [];
      }
      
      return data.categories.map((category: any) => category.strCategory);
    } catch (error) {
      console.error('Error getting recipe categories:', error);
      return [];
    }
  }
  
  // Get random recipes
  async getRandomRecipes(count: number = 10): Promise<Recipe[]> {
    try {
      // TheMealDB only provides a single random recipe per call, so we need to make multiple calls
      const recipes: Recipe[] = [];
      
      for (let i = 0; i < count; i++) {
        const response = await fetch(`${API_BASE_URL}/random.php`);
        const data: MealDBResponse = await response.json();
        
        if (data.meals && data.meals.length > 0) {
          recipes.push(this.processMealData(data.meals[0]));
        }
      }
      
      return recipes;
    } catch (error) {
      console.error('Error getting random recipes:', error);
      return [];
    }
  }
  
  // Find recipes that match user preferences
  async getRecipesForUserPreferences(preferences: UserPreferences): Promise<Recipe[]> {
    try {
      // Start with some recipes that match dietary restrictions
      let matchingRecipes: Recipe[] = [];
      
      // Handle dietary restrictions
      if (preferences.dietaryRestrictions.vegan) {
        // TheMealDB doesn't have a direct vegan filter, so search for "vegan"
        const veganRecipes = await this.searchRecipes('vegan');
        matchingRecipes.push(...veganRecipes);
      } else if (preferences.dietaryRestrictions.vegetarian) {
        const vegetarianRecipes = await this.getRecipesByCategory('Vegetarian');
        matchingRecipes.push(...vegetarianRecipes);
      }
      
      // If no specific dietary restriction, get a mix of random recipes
      if (matchingRecipes.length === 0) {
        matchingRecipes = await this.getRandomRecipes(10);
      }
      
      // Filter out recipes with allergens
      if (preferences.allergies.length > 0) {
        matchingRecipes = matchingRecipes.filter(recipe => {
          const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
          return !preferences.allergies.some(allergen => 
            recipeIngredients.some(ingredient => ingredient.includes(allergen.toLowerCase()))
          );
        });
      }
      
      // Sort recipes by relevance to user preferences
      return this.rankRecipesByPreferences(matchingRecipes, preferences);
    } catch (error) {
      console.error('Error getting recipes for user preferences:', error);
      return [];
    }
  }
  
  // Rank recipes based on how well they match user preferences
  private rankRecipesByPreferences(recipes: Recipe[], preferences: UserPreferences): Recipe[] {
    return recipes.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      
      // Check cuisine preferences
      if (preferences.cuisinePreferences.length > 0) {
        const areaA = a.area.toLowerCase();
        const areaB = b.area.toLowerCase();
        
        for (const cuisine of preferences.cuisinePreferences) {
          const cuisineLower = cuisine.toLowerCase();
          if (areaA.includes(cuisineLower)) scoreA += 2;
          if (areaB.includes(cuisineLower)) scoreB += 2;
        }
      }
      
      // Check taste preferences
      for (const [taste, preferred] of Object.entries(preferences.tastePreferences)) {
        if (preferred) {
          const tasteKeywords: Record<string, string[]> = {
            spicy: ['spicy', 'hot', 'chili', 'pepper', 'cayenne'],
            sweet: ['sweet', 'sugar', 'honey', 'syrup', 'caramel'],
            savory: ['savory', 'umami', 'meat', 'broth', 'stock'],
            bitter: ['bitter', 'coffee', 'dark chocolate', 'beer'],
            sour: ['sour', 'lemon', 'vinegar', 'yogurt', 'lime'],
          };
          
          const keywords = tasteKeywords[taste] || [];
          
          // Check if recipe contains any of the taste keywords
          const aHasKeywords = keywords.some(keyword => 
            a.name.toLowerCase().includes(keyword) || 
            a.instructions.toLowerCase().includes(keyword) ||
            a.ingredients.some(ing => ing.name.toLowerCase().includes(keyword))
          );
          
          const bHasKeywords = keywords.some(keyword => 
            b.name.toLowerCase().includes(keyword) || 
            b.instructions.toLowerCase().includes(keyword) ||
            b.ingredients.some(ing => ing.name.toLowerCase().includes(keyword))
          );
          
          if (aHasKeywords) scoreA += 1;
          if (bHasKeywords) scoreB += 1;
        }
      }
      
      // Return in descending order by score
      return scoreB - scoreA;
    });
  }
}

export default RecipeService.getInstance();