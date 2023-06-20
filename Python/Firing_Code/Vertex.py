class Vertex:
    def __init__(self, neighbors=None, value=0, isSink=False):
        if neighbors is None:
            neighbors = []
        self.neighbors = neighbors
        self.value = value
        self.isSink = isSink

    def fire_node(self):
        if self.isSink:
            return False
        deg = len(self.neighbors)
        if deg <= self.value:
            self.value -= deg
            for vertex in self.neighbors:
                vertex.increment()
            return True
        return False

    def increment(self):
        self.value += 1

    def get_value(self):
        return self.value

    def get_sink(self):
        return self.isSink

    def set_value(self, value):
        self.value = value

    def get_degree(self):
        return len(self.neighbors)

    def set_neighbors(self, neighbors):
        self.neighbors = neighbors
