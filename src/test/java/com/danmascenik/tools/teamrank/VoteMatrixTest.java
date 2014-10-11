package com.danmascenik.tools.teamrank;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import com.danmascenik.tools.teamrank.VoteMatrix.Builder;
import com.google.common.collect.Sets;

public class VoteMatrixTest {

  VoteMatrix<String> m;

  @Test
  public void testInitialMatrixValues() {
    assertEquals(0f, m.valueAt("a", "a"), 0); // self-votes should be ignored
    assertEquals(1f, m.valueAt("a", "b"), 0);
    assertEquals(1f, m.valueAt("a", "c"), 0);
    assertEquals(1f, m.valueAt("a", "d"), 0);
    assertEquals(0f, m.valueAt("a", "e"), 0);

    assertEquals(1f, m.valueAt("b", "a"), 0);
    assertEquals(0f, m.valueAt("b", "b"), 0);
    assertEquals(1f, m.valueAt("b", "c"), 0);
    assertEquals(1f, m.valueAt("b", "d"), 0);
    assertEquals(0f, m.valueAt("b", "e"), 0);

    assertEquals(0f, m.valueAt("c", "a"), 0);
    assertEquals(0f, m.valueAt("c", "b"), 0);
    assertEquals(0f, m.valueAt("c", "c"), 0);
    assertEquals(0f, m.valueAt("c", "d"), 0);
    assertEquals(0f, m.valueAt("c", "e"), 0);

    assertEquals(0f, m.valueAt("d", "a"), 0);
    assertEquals(1f, m.valueAt("d", "b"), 0);
    assertEquals(0f, m.valueAt("d", "c"), 0);
    assertEquals(0f, m.valueAt("d", "d"), 0);
    assertEquals(0f, m.valueAt("d", "e"), 0);

    assertEquals(0f, m.valueAt("e", "a"), 0);
    assertEquals(1f, m.valueAt("e", "b"), 0);
    assertEquals(0f, m.valueAt("e", "c"), 0);
    assertEquals(1f, m.valueAt("e", "d"), 0);
    assertEquals(0f, m.valueAt("e", "e"), 0);
  }

  @Test
  public void testNewInstance() {
    VoteMatrix<String> n = m.makeStochastic();
    assertTrue(m != n);
  }

  @Test
  public void testMakeStochastic() {
    assertFalse(m.isStochastic());
    VoteMatrix<String> s = m.makeStochastic();
    assertNotNull(s);
    assertTrue(s.isStochastic());

    assertEquals(0f, s.valueAt("a", "a"), 0.01f);
    assertEquals(0.33f, s.valueAt("a", "b"), 0.01f);
    assertEquals(0.33f, s.valueAt("a", "c"), 0.01f);
    assertEquals(0.33f, s.valueAt("a", "d"), 0.01f);
    assertEquals(0f, s.valueAt("a", "e"), 0.01f);

    assertEquals(0.33f, s.valueAt("b", "a"), 0.01f);
    assertEquals(0f, s.valueAt("b", "b"), 0.01f);
    assertEquals(0.33f, s.valueAt("b", "c"), 0.01f);
    assertEquals(0.33f, s.valueAt("b", "d"), 0.01f);
    assertEquals(0f, s.valueAt("b", "e"), 0.01f);

    assertEquals(0.25f, s.valueAt("c", "a"), 0.01f);
    assertEquals(0.25f, s.valueAt("c", "b"), 0.01f);
    assertEquals(0f, s.valueAt("c", "c"), 0.01f);
    assertEquals(0.25f, s.valueAt("c", "d"), 0.01f);
    assertEquals(0.25f, s.valueAt("c", "e"), 0.01f);

    assertEquals(0f, s.valueAt("d", "a"), 0.01f);
    assertEquals(1f, s.valueAt("d", "b"), 0.01f);
    assertEquals(0f, s.valueAt("d", "c"), 0.01f);
    assertEquals(0f, s.valueAt("d", "d"), 0.01f);
    assertEquals(0f, s.valueAt("d", "e"), 0.01f);

    assertEquals(0f, s.valueAt("e", "a"), 0.01f);
    assertEquals(0.5f, s.valueAt("e", "b"), 0.01f);
    assertEquals(0f, s.valueAt("e", "c"), 0.01f);
    assertEquals(0.5f, s.valueAt("e", "d"), 0.01f);
    assertEquals(0f, s.valueAt("e", "e"), 0.01f);

    // And the original instance should be unchanged

    assertEquals(0f, m.valueAt("a", "a"), 0);
    assertEquals(1f, m.valueAt("a", "b"), 0);
    assertEquals(1f, m.valueAt("a", "c"), 0);
    assertEquals(1f, m.valueAt("a", "d"), 0);
    assertEquals(0f, m.valueAt("a", "e"), 0);

    assertEquals(1f, m.valueAt("b", "a"), 0);
    assertEquals(0f, m.valueAt("b", "b"), 0);
    assertEquals(1f, m.valueAt("b", "c"), 0);
    assertEquals(1f, m.valueAt("b", "d"), 0);
    assertEquals(0f, m.valueAt("b", "e"), 0);

    assertEquals(0f, m.valueAt("c", "a"), 0);
    assertEquals(0f, m.valueAt("c", "b"), 0);
    assertEquals(0f, m.valueAt("c", "c"), 0);
    assertEquals(0f, m.valueAt("c", "d"), 0);
    assertEquals(0f, m.valueAt("c", "e"), 0);

    assertEquals(0f, m.valueAt("d", "a"), 0);
    assertEquals(1f, m.valueAt("d", "b"), 0);
    assertEquals(0f, m.valueAt("d", "c"), 0);
    assertEquals(0f, m.valueAt("d", "d"), 0);
    assertEquals(0f, m.valueAt("d", "e"), 0);

    assertEquals(0f, m.valueAt("e", "a"), 0);
    assertEquals(1f, m.valueAt("e", "b"), 0);
    assertEquals(0f, m.valueAt("e", "c"), 0);
    assertEquals(1f, m.valueAt("e", "d"), 0);
    assertEquals(0f, m.valueAt("e", "e"), 0);
  }

  @Test
  public void testMakeIrreducible() {
    VoteMatrix<String> g = m.makeStochastic().makeIrreducible(0.15f);
    assertNotNull(g);
  }

  @Test(expected = IllegalStateException.class)
  public void testMakeNonStochasticIrreducible() {
    m.makeIrreducible(0.15f);
  }

  @Before
  public void before() {
    Builder<String> b = new Builder<String>(Sets.newHashSet("a", "b", "c", "d", "e"));
    // no one votes for e
    // c votes for no one
    // everyone votes for b (except c)
    // a votes for everyone except e, including himself
    b.castVote("a", "a");
    b.castVote("a", "b");
    b.castVote("a", "c");
    b.castVote("a", "d");

    b.castVote("b", "a");
    b.castVote("b", "c");
    b.castVote("b", "d");

    b.castVote("d", "b");

    b.castVote("e", "b");
    b.castVote("e", "d");
    m = b.build();
  }

  @After
  public void after() {
    m = null;
  }
}
