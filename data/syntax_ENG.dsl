# ---- Syntax documentation----
# each non-comment line in this file represents a sentence structure
# every literal (e.g. XYZ) must have a corresponding field in the generator's wordTypes array, like wordTypes.XYZ, which holds all the applicable words of that type
#
# ---- Special characters ----
#   # line comment
#     (blank space) and (high precedence)
#   | xor (low precedence)
#   ? optional
#   : apply function
# "xyz": xyz as an absolute string (will not be modified)
#
# ============ EXAMPLE ============
#
# ((A|B) C:x D? E F".")
#
# yields an array with 4 sentences
# 
# A x(C) D E F.
# A x(C) E F.
# B x(C) D E F.
# B x(C) E F.

(((ART|DEP|PSP) ADJ? NOU)|PPS|IDP) (VRB:conjugate|MVB:conjugate|(MVT:conjugate VRB)) ((((ART|DEP|PSP) ADJ? NOU)|PPO) ADJ?:adverb)?("."|"!"|"...")
ART ADJ NOU VRB:conjugate