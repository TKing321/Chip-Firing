from Firing_Code.onevertex import Vertex


class Graph:
    def __init__(self, n):
        temp = []
        values = []
        for i in range(n):
            temp.append(Vertex())
            values.append(i + 1)

        self.vertices = temp

        self.vertices[n // 2].set_value(values)

        for i in range(n):
            v = self.vertices[i]
            neighbors = []
            if i != 0:
                neighbors.append(self.vertices[i - 1])
            if i != n - 1:
                neighbors.append(self.vertices[i + 1])
            v.set_neighbors(neighbors)

    def fire(self, i):
        v = self.vertices[i]
        values = v.get_firing_values()
        v_min, v_max = self.vertices[i - 1].get_value(), self.vertices[i + 1].get_value()
        v_min.append(min(values))
        v_max.append(max(values))
        self.vertices[i - 1].set_value(v_min)
        self.vertices[i + 1].set_value(v_max)
        v.remove_values(values)

    def stabilize(self):
        fired = True
        n = len(self.vertices)
        while fired:
            fired = False
            for i in range(n):
                if i != n//2:
                    val = len(self.vertices[i].get_value())
                    while val > 1:
                        fired = True
                        self.fire(i)
                        val = len(self.vertices[i].get_value())
            if not fired:
                arr = []
                for v in self.vertices:
                    arr.append(len(v.get_value()))
                print(arr)
                i = n//2
                val = len(self.vertices[i].get_value())
                while val > 1:
                    fired = True
                    self.fire(i)
                    val = len(self.vertices[i].get_value())
