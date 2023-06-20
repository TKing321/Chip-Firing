from Firing_Code.onegraph import Graph

# 3 fires the center with 3 chips 3 times before the end
# 4 fires the center with 3 chips 6 times before the end
# 5 fires the center with 3 chips 15 times before the end
# 6 fires the center with 3 chips 30 times before the end
# 7 fires the center with 3 chips 63 times before the end

n = 12

graph = Graph(2 * n + 1)
graph.stabilize()
