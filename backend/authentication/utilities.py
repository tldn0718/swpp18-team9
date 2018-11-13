from collections import defaultdict
from heapq import *

def dijkstra(edges, f, t):
    g = defaultdict(list)
    for l,r,c in edges:
        g[l].append((c,r))

    q, seen, mins = [(0,f,())], set(), {f:0}
    while q:
        (cost, v1, path) = heappop(q)
        if v1 not in seen:
            seen.add(v1)
            path = (v1, path)
            if v1 == t: return (cost,path)

            for c, v2 in g.get(v1,()):
                if v2 in seen: continue
                prev = mins.get(v2, None)
                next = cost + c
                if prev is None or next < prev:
                    mins[v2] = next
                    heappush(q, (next,v2,path))

    return float("inf")

def remove_overlapping_friend(temp_friends):
    friends = []
    for temp_friend in temp_friends:
        temp_user_1 = temp_friend['user_1']
        temp_user_2 = temp_friend['user_2']
        if len(friends) == 0:
            friends.append(temp_friend)
        for friend in friends:
            user_1 = friend['user_1']
            user_2 = friend['user_2']
            if(temp_user_1 == user_1 and temp_user_2 == user_2) or (temp_user_1 == user_2 and temp_user_2 == user_1):
                break
            num_last = len(friends)-1
            if(friend == friends[num_last]):
                friends.append(temp_friend)
    return friends
