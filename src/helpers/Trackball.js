// Trackball implementation based on the http://bl.ocks.org/patricksurry/5721459
const tracballAngle = (projection, pt) => {
    const r = projection.scale();
    const c = projection.translate();
    const x = pt[0] - c[0], y = - (pt[1] - c[1]), ss = x * x + y * y;


    const z = r * r > 2 * ss ? Math.sqrt(r * r - ss) : r * r / 2 / Math.sqrt(ss);

    const lambda = Math.atan2(x, z) * 180 / Math.PI;
    const phi = Math.atan2(y, z) * 180 / Math.PI
    return [lambda, phi];
};

const composedRotation = (λ, ϕ, γ, δλ, δϕ) => {
    λ = Math.PI / 180 * λ;
    ϕ = Math.PI / 180 * ϕ;
    γ = Math.PI / 180 * γ;
    δλ = Math.PI / 180 * δλ;
    δϕ = Math.PI / 180 * δϕ;

    const sλ = Math.sin(λ), sϕ = Math.sin(ϕ), sγ = Math.sin(γ);
    const sδλ = Math.sin(δλ), sδϕ = Math.sin(δϕ);
    const cλ = Math.cos(λ), cϕ = Math.cos(ϕ), cγ = Math.cos(γ);
    const cδλ = Math.cos(δλ), cδϕ = Math.cos(δϕ);

    const m00 = -sδλ * sλ * cϕ + (sγ * sλ * sϕ + cγ * cλ) * cδλ;
    const m01 = -sγ * cδλ * cϕ - sδλ * sϕ;
    const m10 = - sδϕ * sλ * cδλ * cϕ - (sγ * sλ * sϕ + cγ * cλ) * sδλ * sδϕ - (sλ * sϕ * cγ - sγ * cλ) * cδϕ;
    const m11 = sδλ * sδϕ * sγ * cϕ - sδϕ * sϕ * cδλ + cδϕ * cγ * cϕ;
    const m20 = - sλ * cδλ * cδϕ * cϕ - (sγ * sλ * sϕ + cγ * cλ) * sδλ * cδϕ + (sλ * sϕ * cγ - sγ * cλ) * sδϕ;
    const m21 = sδλ * sγ * cδϕ * cϕ - sδϕ * cγ * cϕ - sϕ * cδλ * cδϕ;
    const m22 = cδλ * cδϕ * cλ * cϕ + (sγ * sϕ * cλ - sλ * cγ) * sδλ * cδϕ - (sϕ * cγ * cλ + sγ * sλ) * sδϕ;

    let γ_ = Math.atan2(m10, m00) - m21 * λ;
    let ϕ_ = - m21 * Math.PI / 2;
    let λ_ = λ;

    if (m01 !== 0 || m11 !== 0) {
        γ_ = Math.atan2(-m01, m11);
        ϕ_ = Math.atan2(-m21, Math.sin(γ_) === 0 ? m11 / Math.cos(γ_) : - m01 / Math.sin(γ_));
        λ_ = Math.atan2(-m20, m22);
    }

    return ([λ_ * 180 / Math.PI, ϕ_ * 180 / Math.PI, γ_ * 180 / Math.PI]);
};


export const getTrackballRotation = projection => (originRotation, originPoint, movedPoint) => {
    const o0 = originRotation;
    const m0 = tracballAngle(projection, originPoint);
    const m1 = tracballAngle(projection, movedPoint);
    const o1 = composedRotation(o0[0], o0[1], o0[2], m1[0] - m0[0], m1[1] - m0[1]);

    return o1;
};