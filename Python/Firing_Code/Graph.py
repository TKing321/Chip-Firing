from Firing_Code.Vertex import Vertex


class Graph:
    def __init__(self, vertices=None):
        if vertices is None:
            vertices = []
        self.vertices = vertices

    def add_vertex(self, vertex):
        self.vertices.append(vertex)

    def stabilize(self):
        not_stable = True
        while not_stable:
            fired = False
            for v in self.vertices:
                result = v.fire_node()
                if result:
                    fired = True
            if not fired:
                not_stable = False

    def calc_identity(self):
        for vertex in self.vertices:
            vertex.set_value(vertex.get_degree() * 2 - 2)
        graph_1 = Graph(self.vertices)
        graph_1.stabilize()
        vertices_1 = graph_1.get_vertices()
        for i in range(len(self.vertices)):
            self.vertices[i].set_value = self.vertices[i].get_value() - vertices_1[i].get_value()
        self.stabilize()

    def get_vertices(self):
        return self.vertices

    def get_chips(self):
        temp = 0
        for vertex in self.vertices:
            if not vertex.isSink:
                temp += vertex.get_value()
        return temp

    def build_graph(self, n):
        vertices = []
        for i in range(n ** 2):
            v = Vertex()
            vertices.append(v)
        v_sink = Vertex(isSink=True)
        for i in range(len(vertices)):
            neighbors = []
            if i >= n:
                neighbors.append(vertices[i-n])
            else:
                neighbors.append(v_sink)
            if i % n == 0:
                neighbors.append(v_sink)
            else:
                neighbors.append(vertices[i-1])
            if i % n == n-1:
                neighbors.append(v_sink)
            else:
                neighbors.append(vertices[i+1])
            if i > n ** 2 - n - 1:
                neighbors.append(v_sink)
            else:
                neighbors.append(vertices[i+n])
            vertices[i].set_neighbors(neighbors)
        self.vertices = vertices
