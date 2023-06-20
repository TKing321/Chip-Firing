from numpy.random import choice


class Vertex:
    def __init__(self, neighbors=None, value=None, ):
        if value is None:
            value = []
        if neighbors is None:
            neighbors = []
        self.neighbors = neighbors
        self.value = value

    def set_neighbors(self, neighbors):
        self.neighbors = neighbors

    def set_value(self, value):
        self.value = value

    def get_value(self):
        return self.value

    def get_firing_values(self):
        return choice(self.value, size=2, replace=False)

    def remove_values(self, values):
        self.value = [i for i in self.value if i not in values]
