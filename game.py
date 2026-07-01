from snake import Snake
from food import Food


class Game:
    def __init__(self):
        self.snake = Snake()
        self.food = Food(30, 30)
        self.score = 0

    def update(self):
        self.snake.move()

        if self.snake.body[0] == self.food.position:
            self.snake.grow()
            self.food.position = self.food.new_position()
            self.score += 1

    def check_collision(self):
        head = self.snake.body[0]

        if head[0] < 0 or head[0] >= 30:
            return True

        if head[1] < 0 or head[1] >= 30:
            return True

        if head in self.snake.body[1:]:
            return True

        return False